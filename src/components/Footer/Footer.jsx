import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import logo from '../../images/ChatGPT Image 27_09_2026, 09_08_16.png';
import { EMAIL, PHONES, LINKEDIN } from '../../config/contact';

const pages = [
  { to: '/', label: 'Início' },
  { to: '/portfolio', label: 'Portefólio' },
  { to: '/services', label: 'Serviços' },
  { to: '/contact', label: 'Contactos' },
];

const services = ['Websites', 'Landing Pages', 'Apps Android'];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img src={logo} alt="crtlStudio" className={styles.logo} />
          <p>Sites e apps que trazem clientes a pequenos negócios.</p>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.social}
            aria-label="LinkedIn (abre numa nova janela)"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
            LinkedIn
          </a>
        </div>

        <nav className={styles.col} aria-label="Páginas">
          <h3>Páginas</h3>
          <ul>
            {pages.map((p) => (
              <li key={p.to}><Link to={p.to}>{p.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h3>Serviços</h3>
          <ul>
            {services.map((s) => (
              <li key={s}><Link to="/services">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h3>Contactos</h3>
          <ul>
            <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            {/* Telefones juntos na mesma linha, separados por " / " */}
            <li className={styles.phones}>
              {PHONES.map((p, i) => (
                <span key={p.tel}>
                  {i > 0 && <span className={styles.sep} aria-hidden="true"> / </span>}
                  <a href={`tel:${p.tel}`}>{p.display}</a>
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {year} crtlStudio. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}
