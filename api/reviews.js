// Função serverless da Vercel: avaliações dos clientes.
//   GET  /api/reviews?limit=3  → devolve as últimas avaliações APROVADAS
//   POST /api/reviews          → guarda uma avaliação nova (por aprovar) e envia-te
//                                um email com o botão "Aprovar"
//
// Variáveis de ambiente usadas (já estão na Vercel):
//   DATABASE_URL                         → base de dados Neon
//   GMAIL_USER, GMAIL_APP_PASSWORD       → envio do email (as mesmas do formulário de contacto)
//   CONTACT_TO                           → para onde vai o email de aprovação

import { neon } from '@neondatabase/serverless';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

// Têm de ser iguais aos LIMITS de src/services/reviews.js (o ficheiro do browser)
const LIMITS = { name: 60, project: 80, message: 500 };

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  // ===== Ler avaliações aprovadas =====
  if (req.method === 'GET') {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 3, 1), 10);
      const rows = await sql`
        select id, name, project, message, created_at
        from reviews
        where approved = true
        order by created_at desc
        limit ${limit}
      `;
      // Guarda em cache 1 minuto, para não ir à base de dados em cada visita
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
      return res.status(200).json(rows);
    } catch (err) {
      console.error('Erro ao ler avaliações:', err);
      return res.status(500).json({ error: 'Não foi possível carregar as avaliações.' });
    }
  }

  // ===== Guardar uma avaliação nova =====
  if (req.method === 'POST') {
    const { name = '', project = '', message = '', website = '' } = req.body || {};

    // Campo-armadilha para bots (se um dia o acrescentares ao formulário)
    if (website) return res.status(200).json({ ok: true });

    const data = {
      name: String(name).trim(),
      project: String(project).trim(),
      message: String(message).trim(),
    };

    if (!data.name || !data.project || !data.message) {
      return res.status(400).json({ error: 'Preencha o nome, o projeto e a avaliação.' });
    }
    for (const [field, max] of Object.entries(LIMITS)) {
      if (data[field].length > max) {
        return res.status(400).json({ error: 'O texto é demasiado longo.' });
      }
    }

    // Código secreto que vai no link "Aprovar"
    const token = crypto.randomBytes(24).toString('hex');

    try {
      await sql`
        insert into reviews (name, project, message, token)
        values (${data.name}, ${data.project}, ${data.message}, ${token})
      `;
    } catch (err) {
      console.error('Erro ao guardar avaliação:', err);
      return res.status(500).json({ error: 'Não foi possível enviar a avaliação.' });
    }

    // Email para ti, com o botão "Aprovar". Se o email falhar, a avaliação
    // fica guardada na mesma (podes aprová-la depois no Neon).
    const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
    if (GMAIL_USER && GMAIL_APP_PASSWORD) {
      const approveUrl = `https://${req.headers.host}/api/approve-review?token=${token}`;
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
        });
        await transporter.sendMail({
          from: `"Site crtlStudio" <${GMAIL_USER}>`,
          to: CONTACT_TO || GMAIL_USER,
          subject: `[Site] Nova avaliação — ${data.name}`,
          text: `Nome: ${data.name}\nProjeto: ${data.project}\n\n${data.message}\n\nPara publicar no site, abre: ${approveUrl}`,
          html: `
            <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Projeto:</strong> ${escapeHtml(data.project)}</p>
            <hr>
            <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
            <hr>
            <p>
              <a href="${approveUrl}"
                 style="display:inline-block;padding:10px 20px;background:#2f6bff;color:#fff;border-radius:999px;text-decoration:none">
                Aprovar e publicar no site
              </a>
            </p>
            <p style="color:#888;font-size:12px">Se não quiseres publicar, basta ignorar este email.</p>
          `,
        });
      } catch (err) {
        console.error('Avaliação guardada, mas o email de aprovação falhou:', err);
      }
    }

    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Método não permitido.' });
}
