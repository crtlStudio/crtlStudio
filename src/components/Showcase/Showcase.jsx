import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Showcase.module.css';
import { QUOTE_MAILTO } from '../../config/contact';
import joazinho from '../../assets/Mock_Joazinho.webp';
import delirio from '../../assets/delirio.webp';
import delirio1 from '../../assets/delirio_1.webp';
import delirio3 from '../../assets/delirio_3.webp';
import tdf from '../../assets/Mock_tdF.webp';
import samu from '../../assets/Mock_Samu.webp';
import arena from '../../assets/Mock_Arena.webp';

// Cartões do showcase — altera aqui imagens e descrições (a ordem é a da fila).
// fit: 'phone' (mockup de telemóvel inteiro) | 'site' (capturas de website empilhadas)
const slides = [
  {
    tag: 'App Android',
    title: 'Samu Car Wash',
    text: 'App de marcação de lavagens.',
    images: [samu],
    fit: 'phone',
  },
  {
    tag: 'Landing Page',
    title: 'Joãozinho',
    text: 'Landing page do músico Joãozinho, com contactos e redes sociais.',
    images: [joazinho],
    fit: 'phone',
  },
  {
    tag: 'Website',
    title: 'Delírio',
    text: 'Website de moda com catálogo e páginas de produto, responsivo e otimizado para SEO.',
    images: [delirio, delirio1, delirio3],
    fit: 'site',
  },
  {
    tag: 'App Android',
    title: 'Tás de Folga?',
    text: 'App de organização familiar: calendário, lista de compras e muito mais.',
    images: [tdf],
    fit: 'phone',
  },
  {
    tag: 'App Android',
    title: 'Arena',
    text: 'Jogo de perguntas ao estilo "Quem Quer Ser Milionário", inserido na app Tás de Folga?',
    images: [arena],
    fit: 'phone',
  },
];

const START = 2; // cartão que aparece ao centro quando a página abre

export default function Showcase() {
  const [active, setActive] = useState(START);
  const stageRef = useRef(null);
  const frame = useRef(0);
  const drag = useRef(null);
  const dragged = useRef(false);

  // Centra o cartão i na fila
  const scrollToIndex = (i, behavior = 'smooth') => {
    const stage = stageRef.current;
    const card = stage?.children[i];
    if (!card) return;
    stage.scrollTo({ left: card.offsetLeft + card.offsetWidth / 2 - stage.clientWidth / 2, behavior });
  };

  // O cartão mais perto do centro passa a ser o ativo
  const nearestIndex = () => {
    const stage = stageRef.current;
    const center = stage.scrollLeft + stage.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    [...stage.children].forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < bestDist) { bestDist = dist; best = i; }
    });
    return best;
  };

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => setActive(nearestIndex()));
  };

  useEffect(() => {
    scrollToIndex(START, 'instant');
    return () => cancelAnimationFrame(frame.current);
  }, []);

  // Arrastar com o rato (em ecrãs tácteis o deslizar é nativo)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse') return;
    drag.current = { x: e.clientX, left: stageRef.current.scrollLeft };
    dragged.current = false;
    stageRef.current.classList.add(styles.dragging);
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 5) dragged.current = true;
    stageRef.current.scrollLeft = drag.current.left - dx;
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    stageRef.current.classList.remove(styles.dragging);
    scrollToIndex(nearestIndex());
  };

  const onCardClick = (i) => {
    if (dragged.current) return; // foi um arrasto, não um clique
    scrollToIndex(i);
  };

  return (
    <section className={styles.section}>
      <header className={styles.intro}>
        <h1 className={styles.title}>Sites e apps que trazem clientes ao seu negócio</h1>
        <p className={styles.subtitle}>
          À medida para pequenos negócios: marcações online, Google e WhatsApp, tudo ligado.
        </p>
        <div className={styles.introCta}>
          <a href={QUOTE_MAILTO} className={styles.btnPrimary}>Pedir Orçamento</a>
        </div>
      </header>

      <div className={styles.carousel}>
        <div
          ref={stageRef}
          className={styles.stage}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          tabIndex={0}
          aria-label="Projetos (desliza para ver mais)"
        >
          {slides.map((slide, i) => (
            <article
              key={slide.title}
              className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
              onClick={() => onCardClick(i)}
            >
              {/* O padding do article funciona como moldura de vidro; o conteúdo fica no painel interior */}
              <div className={styles.cardInner}>
                <div className={`${styles.media} ${styles[slide.fit]}`}>
                  {slide.images.map((src, j) => (
                    <img key={src} src={src} alt={j === 0 ? `${slide.tag} ${slide.title}` : ''} draggable="false" />
                  ))}
                </div>
                <div className={styles.info}>
                  <span className={styles.tag}>{slide.tag}</span>
                  <h2>{slide.title}</h2>
                  <p>{slide.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={slide.title}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => scrollToIndex(i)}
              aria-label={`Ver ${slide.title}`}
              aria-current={i === active}
            />
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <Link to="/portfolio" className={styles.btnSecondary}>Ver Portefólio</Link>
      </div>
    </section>
  );
}
