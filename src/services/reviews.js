// Avaliações dos clientes.
//
// Por agora os dados ficam só em memória (perdem-se ao recarregar a página).
// Para ligar ao Supabase, substitui o corpo destas duas funções — o resto do
// site (componente Reviews) não precisa de mudar.
//
// Tabela sugerida no Supabase ("reviews"):
//   id          uuid        primary key default gen_random_uuid()
//   name        text        not null
//   project     text        not null
//   message     text        not null
//   approved    boolean     not null default false   -- só aparecem as aprovadas
//   created_at  timestamptz not null default now()
//
// Exemplo com @supabase/supabase-js:
//   getLatestReviews:
//     const { data, error } = await supabase
//       .from('reviews')
//       .select('id, name, project, message, created_at')
//       .eq('approved', true)
//       .order('created_at', { ascending: false })
//       .limit(limit);
//   submitReview:
//     const { error } = await supabase.from('reviews').insert({ name, project, message });

export const LIMITS = { name: 60, project: 80, message: 500 };

let memory = [];

/** Últimas avaliações publicadas, da mais recente para a mais antiga. */
export async function getLatestReviews(limit = 3) {
  return memory.slice(0, limit);
}

/** Envia uma nova avaliação. Lança um erro se algo falhar. */
export async function submitReview({ name, project, message }) {
  const review = {
    id: crypto.randomUUID(),
    name: name.trim(),
    project: project.trim(),
    message: message.trim(),
    created_at: new Date().toISOString(),
  };
  memory = [review, ...memory];
  return review;
}
