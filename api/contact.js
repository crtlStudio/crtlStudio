// Função serverless da Vercel: recebe o formulário de contacto e envia-o por email (Gmail).
// Variáveis de ambiente necessárias (definir na Vercel → Settings → Environment Variables):
//   GMAIL_USER          → conta Gmail que envia (ex.: geral.crtlstudio@gmail.com)
//   GMAIL_APP_PASSWORD  → palavra-passe de aplicação gerada na conta Google (16 letras)
//   CONTACT_TO          → (opcional) para onde vão as mensagens; por omissão = GMAIL_USER

import nodemailer from 'nodemailer';

const LIMITS = { name: 100, email: 200, subject: 100, message: 5000 };

const escapeHtml = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const isEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { name = '', email = '', subject = '', message = '', website = '' } = req.body || {};

  // Campo escondido "website": só os bots o preenchem. Fingimos sucesso e ignoramos.
  if (website) return res.status(200).json({ ok: true });

  const data = {
    name: String(name).trim(),
    email: String(email).trim(),
    subject: String(subject).trim(),
    message: String(message).trim(),
  };

  if (!data.name || !data.email || !data.message) {
    return res.status(400).json({ error: 'Preencha o nome, o email e a mensagem.' });
  }
  if (!isEmail(data.email)) {
    return res.status(400).json({ error: 'O email indicado não parece válido.' });
  }
  for (const [field, max] of Object.entries(LIMITS)) {
    if (data[field].length > max) {
      return res.status(400).json({ error: 'A mensagem é demasiado longa.' });
    }
  }

  const { GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_TO } = process.env;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error('Faltam as variáveis GMAIL_USER / GMAIL_APP_PASSWORD');
    return res.status(500).json({ error: 'O envio ainda não está configurado.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });

  try {
    await transporter.sendMail({
      from: `"Site crtlStudio" <${GMAIL_USER}>`,
      to: CONTACT_TO || GMAIL_USER,
      replyTo: `"${data.name.replace(/"/g, '')}" <${data.email}>`, // "Responder" vai direto ao cliente
      subject: `[Site] ${data.subject || 'Contacto'} — ${data.name}`,
      text: `Nome: ${data.name}\nEmail: ${data.email}\nAssunto: ${data.subject}\n\n${data.message}`,
      html: `
        <p><strong>Nome:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(data.subject)}</p>
        <hr>
        <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return res.status(500).json({ error: 'Não foi possível enviar a mensagem.' });
  }
}
