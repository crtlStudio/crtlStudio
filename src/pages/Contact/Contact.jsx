import { useState } from 'react';
import Menu from '../../components/Menu';
import styles from './Contact.module.css';
import { EMAIL, PHONES as phones, WHATSAPP } from '../../config/contact';

const subjects = ['Website', 'Landing Page', 'App Android', 'Outro assunto'];

export default function Contact() {
  const emptyForm = { name: '', email: '', subject: subjects[0], message: '', website: '' };
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  // Envia para a função serverless /api/contact (pasta "api" na raiz do projeto).
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Não foi possível enviar a mensagem.');
      setStatus('sent');
      setForm(emptyForm);
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* se o browser bloquear a cópia, o link de email continua disponível */
    }
  };

  return (
    <div>
      <Menu />

      <main className={styles.page}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>Contactos</span>
          <h1>Vamos falar sobre o seu projeto</h1>
          <p>
            Tem uma ideia ou um projeto que quer melhorar?
            Envie-nos uma mensagem ou ligue — respondemos em 1 a 2 dias úteis.
          </p>
        </header>

        <div className={styles.layout}>
          {/* Contactos diretos */}
          <aside className={styles.direct}>
            {/* WhatsApp — o contacto mais rápido, por isso vem primeiro */}
            <div className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
              </span>
              <h2>WhatsApp</h2>
              <p className={styles.note}>A forma mais rápida de falar connosco. Ideal para dúvidas curtas.</p>
              <div className={styles.cardActions}>
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.btnSmall} ${styles.btnWhatsapp}`}
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <h2>Email</h2>
              <a href={`mailto:${EMAIL}`} className={styles.value}>{EMAIL}</a>
              <div className={styles.cardActions}>
                <a href={`mailto:${EMAIL}`} className={styles.btnSmall}>Enviar email</a>
                <button type="button" onClick={copyEmail} className={styles.btnGhost}>
                  {copied ? 'Copiado ✓' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className={styles.card}>
              <span className={styles.icon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <h2>Telefone</h2>
              <ul className={styles.phones}>
                {phones.map((p) => (
                  <li key={p.tel}>
                    <span className={styles.value}>{p.display}</span>
                    <a href={`tel:${p.tel}`} className={styles.btnSmall}>Ligar</a>
                  </li>
                ))}
              </ul>
              <p className={styles.note}>Chamada para a rede móvel nacional.</p>
            </div>
          </aside>

          {/* Formulário */}
          <form className={`${styles.card} ${styles.form}`} onSubmit={handleSubmit}>
            <h2>Envie-nos uma mensagem</h2>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>Nome</span>
                <input type="text" required value={form.name} onChange={update('name')} placeholder="O seu nome" />
              </label>
              <label className={styles.field}>
                <span>Email</span>
                <input type="email" required value={form.email} onChange={update('email')} placeholder="o.seu@email.com" />
              </label>
            </div>

            <label className={styles.field}>
              <span>Assunto</span>
              <select value={form.subject} onChange={update('subject')}>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>

            <label className={styles.field}>
              <span>Mensagem</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={update('message')}
                placeholder="Conte-nos um pouco sobre o que precisa…"
              />
            </label>

            {/* Armadilha para bots: escondido para pessoas, os bots preenchem-no */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={update('website')}
              className={styles.honeypot}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <button type="submit" className={styles.btnPrimary} disabled={status === 'sending'}>
              {status === 'sending' ? 'A enviar…' : 'Enviar mensagem'}
            </button>

            <div aria-live="polite">
              {status === 'sent' && (
                <p className={`${styles.feedback} ${styles.success}`}>
                  Mensagem enviada! Obrigado pelo contacto — respondemos em 1 a 2 dias úteis.
                </p>
              )}
              {status === 'error' && (
                <p className={`${styles.feedback} ${styles.error}`}>
                  {errorMsg} Pode também escrever diretamente para{' '}
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}