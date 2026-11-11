import { useEffect, useState } from 'react';
import Menu from '../../components/Menu';
import styles from './Portfolio.module.css';
import { QUOTE_MAILTO } from '../../config/contact';

import delirioHome from '../../assets/delirio.webp';
import delirioCategory from '../../assets/delirio_1.webp';
import delirioProduct from '../../assets/delirio_2.webp';
import joaozinho from '../../assets/Mock_Joao1.webp';
import samu from '../../assets/Mock_Samu.webp';
import tdf from '../../assets/Mock_tdF.webp';
import arena from '../../assets/Mock_Arena.webp';
import rancho1 from '../../assets/rancho_1.webp';
import rancho2 from '../../assets/rancho_2.webp';

// Projetos — altera aqui textos, tags e imagens.
// type: 'site' (captura de ecrã larga) ou 'phone' (mockup de telemóvel)
// url: (opcional) endereço do projeto online — mostra o botão "Visitar"
// playStore: (opcional) 'soon' = "Brevemente na Google Play"; ou o link da app na Play Store
const projects = [
  {
    id: 'delirio',
    url: 'https://delirio.crtlstudio.pt/',
    title: 'Delírio',
    category: 'Websites',
    type: 'site',
    year: '2026',
    summary: 'Loja de moda com catálogo por secções, pronta para vender online.',
    description:
      'Website de comércio eletrónico com catálogo por categorias, filtros, página de produto com cores e tamanhos e carrinho de compras. Um design limpo e elegante, em tons suaves, que deixa os produtos em destaque.',
    tags: ['E-commerce', 'Catálogo', 'Responsivo'],
    images: [
      { src: delirioHome, alt: 'Delírio — página inicial' },
      { src: delirioCategory, alt: 'Delírio — página de categoria' },
      { src: delirioProduct, alt: 'Delírio — página de produto' },
    ],
  },
  {
    id: 'joaozinho',
    url: 'https://joaozinhooficial.pt/',
    title: 'Joãozinho',
    category: 'Landing Pages',
    type: 'phone',
    year: '2026',
    summary: 'Tudo num só link: contactos para concertos, redes sociais e música.',
    description:
      'Página de apresentação pensada para telemóvel, com contactos diretos para marcação de espetáculos (ligar e enviar email) e ligações às redes sociais e ao Spotify.',
    tags: ['Landing page', 'Artista', 'Mobile first'],
    images: [{ src: joaozinho, alt: 'Landing page do Joãozinho' }],
  },
  {
    id: 'samu',
    url: 'https://samucarwash.crtlstudio.pt/',
    title: 'Samu Car Wash',
    category: 'Apps',
    type: 'phone',
    year: '2026',
    summary: 'Os clientes marcam lavagens sozinhos pelo telemóvel, sem telefonemas.',
    description:
      'Aplicação Android onde os clientes escolhem o pack de lavagem e fazem a marcação em poucos toques, com acesso rápido a WhatsApp, Facebook e localização.',
    tags: ['Android', 'Marcações', 'Negócio local'],
    images: [{ src: samu, alt: 'App Samu Car Wash' }],
  },
  {
    id: 'rancho',
    url: 'https://ranchotipicostmreguenga.crtlstudio.pt/',
    title: 'Rancho Típico de Santa Maria da Reguenga',
    category: 'Websites',
    type: 'site',
    year: '2026',
    summary: 'Site de um rancho folclórico, com área reservada para os elementos do grupo.',
    description:
      'Website de apresentação do rancho, com galeria de fotografias, mapa e contactos. Inclui uma área reservada onde os elementos entram com código de convite, consultam a agenda de atuações e indicam se vão ou não.',
    tags: ['Associação', 'Área de membros', 'Agenda'],
    images: [
      { src: rancho1, alt: 'Rancho Típico de Santa Maria da Reguenga — página inicial' },
      { src: rancho2, alt: 'Rancho Típico de Santa Maria da Reguenga — outra página do site' },
    ],
  },
  {
    id: 'tdf',
    playStore: 'soon', // quando a app estiver publicada, troca por 'https://play.google.com/store/apps/details?id=...'
    title: 'Tás de Folga?',
    category: 'Apps',
    type: 'phone',
    wide: true, // cartão a ocupar 2 colunas, com os dois telemóveis lado a lado
    year: '2026',
    summary: 'Escalas de trabalho, calendário e compras da família num só lugar, com um jogo de perguntas incluído.',
    description:
      'Aplicação Android para organizar a vida em família: horários de trabalho, calendário, consultas, aulas, aniversários, lista de compras e notas — tudo num só lugar, com um visual acolhedor. Inclui a Arena, um jogo de perguntas ao estilo "Quem Quer Ser Milionário", com modo multijogador, desafio diário e ranking.',
    tags: ['Android', 'Calendário', 'Família', 'Jogo'],
    images: [
      { src: tdf, alt: 'App Tás de Folga? — ecrã principal' },
      { src: arena, alt: 'Arena — jogo de perguntas dentro da app Tás de Folga?' },
    ],
  },
];

const filters = ['Todos', 'Websites', 'Landing Pages', 'Apps'];

// Apps com cartão largo mostram dois telemóveis lado a lado
const showPair = (p) => p.type === 'phone' && p.wide && p.images.length > 1;

// Ícone simples do "play" da Google Play
function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M4 2.5v19a1 1 0 0 0 1.5.86l16-9.5a1 1 0 0 0 0-1.72l-16-9.5A1 1 0 0 0 4 2.5z" />
    </svg>
  );
}

function ProjectModal({ project, onClose }) {
  const [index, setIndex] = useState(0);
  const total = project.images.length;

  // Fechar com Esc e navegar com as setas do teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, total - 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0));
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, total]);

  const image = project.images[index];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.close} onClick={onClose} aria-label="Fechar">×</button>

        <div className={`${styles.modalMedia} ${styles[project.type]}`}>
          <img key={image.src} src={image.src} alt={image.alt} />

          {total > 1 && (
            <>
              <button
                className={`${styles.navBtn} ${styles.navLeft}`}
                onClick={() => setIndex(index - 1)}
                disabled={index === 0}
                aria-label="Imagem anterior"
              >‹</button>
              <button
                className={`${styles.navBtn} ${styles.navRight}`}
                onClick={() => setIndex(index + 1)}
                disabled={index === total - 1}
                aria-label="Imagem seguinte"
              >›</button>
              <span className={styles.counter}>{index + 1} / {total}</span>
            </>
          )}
        </div>

        <div className={styles.modalText}>
          <span className={styles.category}>{project.category} · {project.year}</span>
          <h2 id="modal-title">{project.title}</h2>
          <p>{project.description}</p>
          <ul className={styles.tags}>
            {project.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>

          {project.playStore === 'soon' && (
            <span className={styles.storeSoon}>
              <PlayIcon /> Brevemente na Google Play
            </span>
          )}
          {project.playStore && project.playStore !== 'soon' && (
            <a
              href={project.playStore}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visit}
            >
              <PlayIcon /> Disponível na Google Play ↗
            </a>
          )}

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.visit}
            >
              Visitar {project.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState('Todos');
  const [open, setOpen] = useState(null);

  const visible = filter === 'Todos' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <Menu />

      <main className={styles.page}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>Portefólio</span>
          <h1>Projetos que já ganharam vida</h1>
          <p>Alguns dos websites, landing pages e apps que desenvolvemos. Escolha um projeto para ver mais detalhes.</p>
        </header>

        <div className={styles.filters} role="tablist" aria-label="Filtrar projetos">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visible.map((p) => (
            <button
              key={p.id}
              className={`${styles.project} ${p.type === 'site' || p.wide ? styles.wide : ''}`}
              onClick={() => setOpen(p)}
            >
              <div className={`${styles.media} ${styles[p.type]} ${showPair(p) ? styles.phonePair : ''}`}>
                {showPair(p)
                  ? p.images.slice(0, 2).map((img) => (
                      <img key={img.src} src={img.src} alt={img.alt} loading="lazy" />
                    ))
                  : <img src={p.images[0].src} alt={p.images[0].alt} loading="lazy" />}
                {p.url && <span className={`${styles.badge} ${styles.badgeLive}`}>● Online</span>}
                {p.playStore && (
                  <span className={`${styles.badge} ${styles.badgeStore}`}>
                    {p.playStore === 'soon' ? 'Brevemente na Play Store' : 'Na Play Store'}
                  </span>
                )}
                {p.images.length > 1 && !showPair(p) && (
                  <span className={styles.badge}>{p.images.length} imagens</span>
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.category}>{p.category}</span>
                <h2>{p.title}</h2>
                <p>{p.summary}</p>
                <span className={styles.more}>Ver projeto →</span>
              </div>
            </button>
          ))}
        </div>

        <section className={styles.cta}>
          <h2>O próximo projeto pode ser o seu</h2>
          <p>Conte-nos a sua ideia e preparamos uma proposta sem compromisso.</p>
          <a href={QUOTE_MAILTO} className={styles.btnPrimary}>Pedir Orçamento</a>
        </section>
      </main>

      {open && <ProjectModal project={open} onClose={() => setOpen(null)} />}
    </div>
  );
}