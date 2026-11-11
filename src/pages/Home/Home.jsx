import Menu from '../../components/Menu';
import Showcase from '../../components/Showcase';
import Reviews from '../../components/Reviews';
import styles from './Home.module.css';


function Home() {
  return (
    <>
    <div className={styles.Container}>
        <Menu />

        <Showcase />

        <Reviews />

    </div>
    </>
  );
}

export default Home;
