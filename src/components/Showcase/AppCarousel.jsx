import { useEffect, useState } from 'react';
import styles from './Showcase.module.css';
import arena from '../../assets/Mock_Arena.webp';
import samu from '../../assets/Mock_Samu.webp';
import tdf from '../../assets/Mock_tdF.webp';

// Apps mostradas no carrossel — altera aqui nomes e imagens.
const apps = [
  {
    name: 'Arena',
    description: 'Jogo de perguntas ao estilo "Quem Quer Ser Milionário", inserido na app Tás de Folga?',
    image: arena,
  },
  {
    name: 'Samu Car Wash',
    description: 'App de marcação de lavagens.',
    image: samu,
  },
  {
    name: 'Tás de Folga?',
    description: 'App de organização familiar: calendário, lista de compras e muito mais…',
    image: tdf,
  },
];

const INTERVAL = 8000; // ms entre cada troca automática

export default function AppCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = apps.length;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return;
    const id = setInterval(() => setActive((i) => (i + 1) % total), INTERVAL);
    return () => clearInterval(id);
  }, [paused, total]);

  const go = (i) => setActive((i + total) % total);

  // Posição de cada telemóvel em relação ao ativo: centro, esquerda ou direita
  const position = (i) => {
    const diff = (i - active + total) % total;
    if (diff === 0) return styles.slideCenter;
    if (diff === 1) return styles.slideRight;
    return styles.slideLeft;
  };

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrossel"
    >
      <div className={styles.stage}>
        {apps.map((app, i) => (
          <img
            key={app.name}
            src={app.image}
            alt={`App ${app.name}`}
            className={`${styles.slide} ${position(i)}`}
            onClick={() => go(i)}
            aria-hidden={i !== active}
            draggable="false"
          />
        ))}

        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => go(active - 1)} aria-label="App anterior">‹</button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => go(active + 1)} aria-label="App seguinte">›</button>
      </div>

      <div className={styles.carouselFooter}>
        <div className={styles.appInfo} aria-live="polite">
          <span key={active} className={styles.appName}>{apps[active].name}</span>
          <p key={`d${active}`} className={styles.appDesc}>{apps[active].description}</p>
        </div>
        <div className={styles.dots}>
          {apps.map((app, i) => (
            <button
              key={app.name}
              className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
              onClick={() => go(i)}
              aria-label={`Ver ${app.name}`}
              aria-current={i === active}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
