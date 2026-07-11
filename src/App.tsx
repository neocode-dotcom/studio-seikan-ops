import Nav from './components/Nav';
import Hero from './components/Hero';
import Problema from './components/Problema';
import Servicios from './components/Servicios';
import Cumplimiento from './components/Cumplimiento';
import Proceso from './components/Proceso';
import Auditoria from './components/Auditoria';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative w-full min-h-screen">
      <Nav />
      <Hero />
      <Problema />
      <Servicios />
      <Cumplimiento />
      <Proceso />
      <Auditoria />
      <Footer />
    </div>
  );
}

export default App;
