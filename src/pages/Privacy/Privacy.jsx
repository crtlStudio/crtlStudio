import { Link } from 'react-router-dom';
import Menu from '../../components/Menu';
import styles from './Privacy.module.css';
import { EMAIL } from '../../config/contact';

// Política de Privacidade — altera aqui a data sempre que mudares o texto.
const LAST_UPDATE = '11 de novembro de 2026';

export default function Privacy() {
  return (
    <div>
      <Menu />

      <main className={styles.page}>
        <header className={styles.intro}>
          <span className={styles.eyebrow}>Privacidade</span>
          <h1>Política de Privacidade</h1>
          <p>Última atualização: {LAST_UPDATE}</p>
        </header>

        <article className={styles.content}>
          <section>
            <h2>1. Quem é o responsável pelos seus dados</h2>
            <p>
              O responsável pelo tratamento dos dados recolhidos neste site é Pedro Leal, que trabalha
              sob a marca crtlStudio, com sede em Santo Tirso, Portugal.
            </p>
            <p>
              Para qualquer questão sobre os seus dados, pode escrever para{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
            </p>
          </section>

          <section>
            <h2>2. Que dados recolhemos</h2>
            <p>Só recolhemos os dados que nos envia através do formulário de contacto:</p>
            <ul>
              <li>Nome</li>
              <li>Endereço de email</li>
              <li>Assunto e mensagem</li>
            </ul>
            <p>
              Se nos contactar por email, telefone ou WhatsApp, tratamos também os dados que partilhar
              nessa conversa.
            </p>
          </section>

          <section>
            <h2>3. Para que usamos os seus dados</h2>
            <p>
              Usamos os seus dados apenas para responder ao seu pedido e, se for o caso, preparar e
              enviar um orçamento. Não enviamos publicidade, não vendemos nem partilhamos os seus
              dados com terceiros para fins comerciais.
            </p>
            <p>
              A base legal é a realização de diligências pré-contratuais a seu pedido (artigo 6.º,
              n.º 1, alínea b) do RGPD).
            </p>
          </section>

          <section>
            <h2>4. Durante quanto tempo guardamos os dados</h2>
            <p>
              Guardamos as mensagens durante o tempo necessário para responder ao seu pedido. Se não
              avançarmos com nenhum projeto, apagamos os dados no prazo máximo de 12 meses. Se
              trabalharmos juntos, os dados ficam guardados enquanto durar a relação comercial e
              durante os prazos exigidos por lei (por exemplo, para efeitos de faturação).
            </p>
          </section>

          <section>
            <h2>5. Serviços que usamos</h2>
            <p>Para que o site e o formulário funcionem, recorremos a estes serviços:</p>
            <ul>
              <li><strong>Vercel</strong>: alojamento do site e envio do formulário.</li>
              <li><strong>Google (Gmail)</strong>: entrega das mensagens do formulário.</li>
              <li><strong>PTisp</strong>: domínio e caixa de email.</li>
            </ul>
            <p>
              Alguns destes serviços podem tratar dados fora da União Europeia, sempre com as
              garantias previstas no RGPD.
            </p>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>
              Este site não usa cookies de publicidade nem de análise de visitantes.
            </p>
          </section>

          <section>
            <h2>7. Os seus direitos</h2>
            <p>A qualquer momento, pode pedir-nos para:</p>
            <ul>
              <li>consultar os dados que temos sobre si;</li>
              <li>corrigir dados incorretos;</li>
              <li>apagar os seus dados;</li>
              <li>limitar ou opor-se ao tratamento;</li>
              <li>receber os seus dados num formato que possa usar noutro serviço.</li>
            </ul>
            <p>
              Basta escrever para <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Respondemos no prazo
              máximo de 30 dias.
            </p>
            <p>
              Se considerar que os seus dados não foram tratados corretamente, pode apresentar
              queixa à Comissão Nacional de Proteção de Dados (CNPD), em{' '}
              <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">www.cnpd.pt</a>.
            </p>
          </section>
        </article>

        <div className={styles.back}>
          <Link to="/contact" className={styles.btnSecondary}>Voltar aos contactos</Link>
        </div>
      </main>
    </div>
  );
}
