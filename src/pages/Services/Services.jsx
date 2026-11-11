import { Link } from 'react-router-dom';
import Menu from '../../components/Menu';
import styles from './Services.module.css';
import { QUOTE_MAILTO } from '../../config/contact';
import ServiceIcon from './ServiceIcons';

// Serviços principais — altera aqui títulos, textos e o que está incluído.
const mainServices = [
  {
    id: 'websites',
    icon: 'websites',
    title: 'Websites',
    lead: 'Um site profissional que apresenta o seu negócio, transmite confiança e funciona em qualquer ecrã.',
    includes: [
      'Design à medida, com a cara do seu negócio',
      'Fica bem no telemóvel, no tablet e no computador',
      'Preparado para aparecer no Google quando procuram o seu serviço',
      'Rápido a abrir, para ninguém desistir à espera',
      'Clientes contactam-no com um toque: telefone, email ou WhatsApp',
    ],
    ideal: 'Empresas, lojas, restaurantes, profissionais liberais.',
    price: 'Desde 315 €',
    time: 'Pronto em 2–3 semanas',
  },
  {
    id: 'landing-pages',
    icon: 'landing',
    title: 'Landing Pages',
    lead: 'Uma página simples e direta, para apresentar uma oferta, um evento ou um artista e transformar visitas em contactos.',
    includes: [
      'Feita para o visitante ligar, comprar ou inscrever-se',
      'Textos claros, que explicam a sua oferta em segundos',
      'Botões diretos para telefone, email e WhatsApp',
      'Ligação às suas redes: Instagram, Spotify, YouTube…',
      'Pronta depressa, ideal para campanhas e lançamentos',
    ],
    ideal: 'Artistas, eventos, campanhas, lançamentos de produtos.',
    price: 'Desde 135 €',
    time: 'Pronto em 1 semana',
  },
  {
    id: 'apps',
    icon: 'apps',
    title: 'Apps Android',
    lead: 'Aplicações que simplificam o dia a dia dos seus clientes ou da sua equipa.',
    includes: [
      'Fácil de usar, mesmo para quem não percebe de tecnologia',
      'Os seus clientes marcam sozinhos, sem telefonemas',
      'Lembretes e notificações automáticas',
      'Cada cliente com a sua conta e tudo sempre atualizado',
      'Publicação na Play Store tratada por nós',
      'No iPhone, funciona no browser e pode ficar no ecrã inicial',
    ],
    ideal: 'Negócios com marcações: cabeleireiros, oficinas, lavagens, clínicas, ginásios.',
    price: 'Desde 720 €',
    time: 'Pronto em 6–10 semanas',
  },
];

// Outros serviços
const otherServices = [
  {
    icon: 'improve',
    title: 'Melhorias e novas funcionalidades',
    text: 'Alterações e novas funcionalidades em projetos já existentes, mesmo que tenham sido feitos por outra pessoa.',
  },
  {
    icon: 'performance',
    title: 'Performance e SEO',
    text: 'Otimização de velocidade, imagens e estrutura para carregar mais rápido e aparecer melhor no Google.',
  },
  {
    icon: 'maintenance',
    title: 'Manutenção',
    text: 'Atualizações, cópias de segurança e acompanhamento para que tudo continue a funcionar sem surpresas.',
  },
  {
    icon: 'consulting',
    title: 'Consultoria',
    text: 'Tem uma ideia mas não sabe por onde começar? Nós ajudamos a definir o projeto, as funcionalidades e o melhor caminho.',
  },
];

// Como trabalhamos
const steps = [
  { title: 'Conversa gratuita', text: 'Percebemos o que precisa e quais são os seus objetivos, sem qualquer compromisso.' },
  { title: 'Proposta', text: 'Enviamos um orçamento claro, com prazos e o que está incluído.' },
  { title: 'Desenvolvimento', text: 'Construímos o projeto e vamos mostrando o progresso.' },
  { title: 'Entrega e suporte', text: 'Publicamos, explicamos como funciona e continuamos disponíveis.' },
];

export default function Services() {
  return (
    <div>
      <Menu />

      <main className={styles.page}>
        {/* Introdução */}
        <header className={styles.intro}>
          <span className={styles.eyebrow}>Serviços</span>
          <h1>O que podemos fazer por si</h1>
          <p>
            Criamos landing pages, websites e apps Android à sua medida, pensados para trazer
            clientes ao seu negócio.
          </p>
          <nav className={styles.jump} aria-label="Ir para serviço">
            {mainServices.map((s) => (
              <a key={s.id} href={`#${s.id}`}>{s.title}</a>
            ))}
            <a href="#outros">Outros serviços</a>
          </nav>
        </header>

        {/* Serviços principais */}
        <section className={styles.mainList}>
          {mainServices.map((s, i) => (
            <article key={s.id} id={s.id} className={styles.service}>
              <div className={styles.serviceHead}>
                <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.icon} aria-hidden="true">
                  <ServiceIcon name={s.icon} />
                </span>
                <h2>{s.title}</h2>
                <p className={styles.lead}>{s.lead}</p>
                <p className={styles.ideal}><strong>Ideal para:</strong> {s.ideal}</p>
                <p className={styles.price}>
                  <strong>{s.price}</strong> · {s.time}
                </p>
              </div>

              <ul className={styles.includes}>
                {s.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        {/* Outros serviços */}
        <section id="outros" className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Outros serviços</h2>
            <p>Para além de criar projetos novos, também ajudamos a melhorar e a manter os que já tem.</p>
          </div>

          <div className={styles.otherGrid}>
            {otherServices.map((s) => (
              <article
                key={s.title} className={styles.otherCard}>
                <span className={styles.icon} aria-hidden="true">
                  <ServiceIcon name={s.icon} size={20} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Processo */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2>Como trabalhamos</h2>
          </div>

          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={step.title} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Chamada para ação */}
        <section className={styles.cta}>
          <h2>Tem um projeto em mente?</h2>
          <p>Fale connosco — a primeira conversa e o orçamento não têm qualquer compromisso.</p>
          <div className={styles.actions}>
            <a href={QUOTE_MAILTO} className={styles.btnPrimary}>Pedir Orçamento</a>
            <Link to="/portfolio" className={styles.btnSecondary}>Ver Portefólio</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
