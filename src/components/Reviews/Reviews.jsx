import { useEffect, useRef, useState } from 'react';
import styles from './Reviews.module.css';
import { getLatestReviews, submitReview, LIMITS } from '../../services/reviews';

const EMPTY_FORM = { name: '', project: '', message: '' };

const dateFormat = new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const dialogRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getLatestReviews(3)
      .then((data) => { if (alive) setReviews(data); })
      .catch(() => { if (alive) setReviews([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  const openForm = () => {
    setForm(EMPTY_FORM);
    setStatus('idle');
    dialogRef.current?.showModal();
  };

  const closeForm = () => dialogRef.current?.close();

  // Fecha ao clicar fora da caixa do formulário
  const onDialogClick = (e) => {
    if (e.target === dialogRef.current) closeForm();
  };

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      await submitReview(form);
      setReviews(await getLatestReviews(3));
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };


  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className={styles.inner}>
        {/* Esquerda: últimas avaliações */}
        <div className={styles.list}>
          <h2 id="reviews-title" className={styles.heading}>O que dizem os nossos clientes</h2>

          {loading ? (
            <p className={styles.empty}>A carregar avaliações…</p>
          ) : reviews.length === 0 ? (
            <p className={styles.empty}>Ainda não há avaliações. Seja o primeiro a deixar a sua!</p>
          ) : (
            <ul className={styles.cards}>
              {reviews.map((r) => (
                <li key={r.id} className={styles.card}>
                  <span className={styles.quote} aria-hidden="true">“</span>
                  <p className={styles.message}>{r.message}</p>
                  <div className={styles.author}>
                    <strong>{r.name}</strong>
                    <span>{r.project}</span>
                  </div>
                  <time className={styles.date} dateTime={r.created_at}>
                    {dateFormat.format(new Date(r.created_at))}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Direita: botão de vidro que abre o formulário */}
        <div className={styles.ctaWrap}>
          <button type="button" className={styles.glassBtn} onClick={openForm}>
            <span className={styles.glassIcon} aria-hidden="true">★</span>
            Deixe-nos a sua avaliação
          </button>
        </div>
      </div>

      {/* Formulário (janela modal) */}
      <dialog ref={dialogRef} className={styles.dialog} onClick={onDialogClick} aria-labelledby="review-form-title">
        <div className={styles.dialogBox}>
          <button type="button" className={styles.close} onClick={closeForm} aria-label="Fechar">×</button>

          {status === 'sent' ? (
            <div className={styles.thanks}>
              <h3 id="review-form-title">Obrigado pela sua avaliação!</h3>
              <p>A sua opinião ajuda-nos a melhorar e a chegar a mais pessoas.</p>
              <button type="button" className={styles.submit} onClick={closeForm}>Fechar</button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <h3 id="review-form-title">Deixe-nos a sua avaliação</h3>

              <label className={styles.field}>
                <span>Nome</span>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  maxLength={LIMITS.name}
                  autoComplete="name"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Projeto</span>
                <input
                  name="project"
                  value={form.project}
                  onChange={onChange}
                  maxLength={LIMITS.project}
                  placeholder="Ex.: Website da minha loja"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Avaliação</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  maxLength={LIMITS.message}
                  rows={5}
                  placeholder="Conte-nos como foi trabalhar connosco…"
                  required
                />
                <small className={styles.counter}>{form.message.length}/{LIMITS.message}</small>
              </label>

              {status === 'error' && (
                <p className={styles.error} role="alert">Não foi possível enviar. Tente novamente daqui a pouco.</p>
              )}

              <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                {status === 'sending' ? 'A enviar…' : 'Enviar avaliação'}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
