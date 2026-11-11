// Avaliações dos clientes — lado do browser.
//
// Fala com a função serverless api/reviews.js (Vercel + base de dados Neon):
//   GET  /api/reviews?limit=3  → últimas avaliações APROVADAS
//   POST /api/reviews          → envia uma avaliação nova (fica à espera de aprovação)
//
// Atenção: este ficheiro corre no browser. Não pôr aqui código de servidor
// (base de dados, nodemailer, process.env) — isso vive em api/reviews.js.

// Têm de ser iguais aos LIMITS de api/reviews.js
export const LIMITS = { name: 60, project: 80, message: 500 };

/** Últimas avaliações aprovadas, da mais recente para a mais antiga. */
export async function getLatestReviews(limit = 3) {
  const res = await fetch(`/api/reviews?limit=${encodeURIComponent(limit)}`);
  if (!res.ok) throw new Error('Não foi possível carregar as avaliações.');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/** Envia uma nova avaliação (fica por aprovar). Lança um erro se algo falhar. */
export async function submitReview({ name, project, message }) {
  const res = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, project, message }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Não foi possível enviar a avaliação.');
  return data;
}
