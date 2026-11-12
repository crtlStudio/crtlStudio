import './App.css'

import { useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Portfolio from './pages/Portfolio';
import Privacy from './pages/Privacy';
import Footer from './components/Footer';

// Ao mudar de página, volta ao topo (exceto quando o link aponta para uma secção, ex.: #outros)
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Fade-in subtil (2s) de todo o conteúdo sempre que se muda de página
function usePageFadeIn() {
  const ref = useRef(null);
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !el.animate) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const anim = el.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 2000,
      easing: 'ease-out',
    });
    return () => anim.cancel();
  }, [pathname]);
  return ref;
}

function App() {
  const fadeRef = usePageFadeIn();
  return (
    <div className="app" ref={fadeRef}>
      <ScrollToTop />
      <div className="appContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App
