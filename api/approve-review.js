// Função serverless da Vercel: aprovar uma avaliação a partir do email.
//   GET  /api/approve-review?token=...  → mostra a avaliação e um botão "Confirmar"
//   POST /api/approve-review?token=...  → aprova (approved = true) e mostra a confirmação
//
// Porquê dois passos? Alguns serviços de email (Outlook, antivírus) abrem
// sozinhos os links dos emails para os verificarem. Se bastasse abrir o link,
// a avaliação podia ser aprovada sem tu carregares em nada.

import { neon } from '@neondatabase/serverless';

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Página simples, no estilo escuro do site
const page = (title, body) => `<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${title} · crtlStudio</title>
  <style>
    body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center;
           background:#050814; color:#fff; font-family:system-ui, sans-serif; padding:20px; }
    .box { max-width:460px; width:100%; background:rgba(255,255,255,0.05);
           border:1px solid rgba(255,255,255,0.12); border-radius:18px; padding:28px; }
    h1 { font-size:1.2rem; font-weight:500; margin:0 0 14px; }
    p { color:rgba(255,255,255,0.75); line-height:1.55; font-size:0.92rem; }
    blockquote { margin:16px 0; padding:12px 16px; border-left:3px solid #2f6bff;
                 background:rgba(0,0,0,0.25); border-radius:8px; white-space:pre-wrap; }
    button, a.btn { display:inline-block; margin-top:8px; padding:11px 22px; border:none; border-radius:999px;
                    background:#2f6bff; color:#fff; font-size:0.9rem; cursor:pointer; text-decoration:none; }
  </style>
</head>
<body><div class="box">${body}</div></body>
</html>`;

export default async function handler(req, res) {
  const token = String(req.query.token || '');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (!/^[a-f0-9]{48}$/.test(token)) {
    return res.status(400).send(page('Link inválido', '<h1>Link inválido</h1><p>Este link de aprovação não é válido.</p>'));
  }

  const sql = neon(process.env.DATABASE_URL);

  try {
    // ===== Mostrar a avaliação e pedir confirmação =====
    if (req.method === 'GET') {
      const [review] = await sql`select name, project, message, approved from reviews where token = ${token}`;
      if (!review) {
        return res.status(404).send(page('Não encontrada', '<h1>Avaliação não encontrada</h1><p>Pode ter sido apagada.</p>'));
      }
      if (review.approved) {
        return res.status(200).send(page('Já publicada', `
          <h1>Esta avaliação já está publicada ✓</h1>
          <a class="btn" href="/">Ver o site</a>`));
      }
      return res.status(200).send(page('Aprovar avaliação', `
        <h1>Publicar esta avaliação?</h1>
        <p><strong>${escapeHtml(review.name)}</strong> · ${escapeHtml(review.project)}</p>
        <blockquote>${escapeHtml(review.message)}</blockquote>
        <form method="POST" action="/api/approve-review?token=${token}">
          <button type="submit">Confirmar e publicar</button>
        </form>`));
    }

    // ===== Aprovar =====
    if (req.method === 'POST') {
      const [review] = await sql`
        update reviews set approved = true
        where token = ${token}
        returning name
      `;
      if (!review) {
        return res.status(404).send(page('Não encontrada', '<h1>Avaliação não encontrada</h1><p>Pode ter sido apagada.</p>'));
      }
      return res.status(200).send(page('Publicada', `
        <h1>Avaliação publicada ✓</h1>
        <p>A avaliação de <strong>${escapeHtml(review.name)}</strong> já aparece no site
        (pode demorar até 1 minuto).</p>
        <a class="btn" href="/">Ver o site</a>`));
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send(page('Erro', '<h1>Método não permitido</h1>'));
  } catch (err) {
    console.error('Erro ao aprovar avaliação:', err);
    return res.status(500).send(page('Erro', '<h1>Ocorreu um erro</h1><p>Tenta outra vez daqui a pouco.</p>'));
  }
}
