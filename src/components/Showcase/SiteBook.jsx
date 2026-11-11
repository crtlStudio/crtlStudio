import { useState } from 'react';
import styles from './Showcase.module.css';
import home from '../../assets/delirio.webp';
import category from '../../assets/delirio_1.webp';
import product from '../../assets/delirio_2.webp';

// Páginas do "livro" — a primeira fica por cima e vira para revelar as seguintes.
const pages = [
  { src: home, alt: 'Website Delírio — página inicial' },
  { src: category, alt: 'Website Delírio — página de categoria' },
  { src: product, alt: 'Website Delírio — página de produto' },
];

export default function SiteBook() {
  const [current, setCurrent] = useState(0);
  const total = pages.length;

  const prev = () => setCurrent((c) => Math.max(c - 1, 0));
  const next = () => setCurrent((c) => Math.min(c + 1, total - 1));

  return (
    <div className={styles.siteWrap}>
      <div className={styles.book}>
        {pages.map((page, i) => (
          <div
            key={page.src}
            className={`${styles.page} ${i < current ? styles.pageFlipped : ''}`}
            style={{ zIndex: total - i }}
          >
            <img src={page.src} alt={page.alt} aria-hidden={i !== current} draggable="false" />
          </div>
        ))}
      </div>

      <button
        className={`${styles.arrow} ${styles.bookArrow} ${styles.bookArrowLeft}`}
        onClick={prev}
        disabled={current === 0}
        aria-label="Página anterior"
      >‹</button>
      <button
        className={`${styles.arrow} ${styles.bookArrow} ${styles.bookArrowRight}`}
        onClick={next}
        disabled={current === total - 1}
        aria-label="Página seguinte"
      >›</button>
    </div>
  );
}
