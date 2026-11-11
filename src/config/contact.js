// Dados de contacto partilhados por todo o site.
export const EMAIL = 'pedroleal@crtlstudio.pt';

// Telefones — "display" é o que aparece, "tel" é o número usado no link.
export const PHONES = [
  { display: '939 236 403', tel: '+351939236403' },
];

// WhatsApp — número (só dígitos, com indicativo) e mensagem inicial
const whatsappNumber = '351939236403';
const whatsappText = 'Olá! Gostaria de saber mais sobre os vossos serviços.';
export const WHATSAPP = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

// Página da empresa no LinkedIn
export const LINKEDIN = 'https://www.linkedin.com/company/crtlstudio';

// Link usado em todos os botões "Pedir Orçamento": abre o email já com assunto e um guia.
const quoteSubject = 'Pedido de orçamento';
const quoteBody = [
  'Olá,',
  '',
  'Gostaria de pedir um orçamento para:',
  '',
  'Tipo de projeto (website / landing page / app Android / outro):',
  'Breve descrição:',
  'Prazo pretendido:',
  '',
  'Obrigado!',
].join('\n');

export const QUOTE_MAILTO =
  `mailto:${EMAIL}?subject=${encodeURIComponent(quoteSubject)}&body=${encodeURIComponent(quoteBody)}`;
