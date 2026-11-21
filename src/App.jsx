import { useEffect, useRef, useState } from "react";
import Brand from "./components/Brand";
import Consultation from "./components/Consultation";
import { siteConfig } from "./config/site";
import { services, steps } from "./data/content";
import ProjectCards from "./components/ProjectCards";

const nav = [
  ["Inicio", "inicio"], ["Servicios", "servicios"], ["Proceso", "proceso"],
  ["Proyectos", "proyectos"], ["Nosotras", "nosotras"], ["Contacto", "contacto"]
];

const team = siteConfig.people.join(" · ");
const initials = siteConfig.people.map((name) => name[0]);

function ConsultButton({ onClick }) {
  return (
    <button type="button" className="btn" aria-haspopup="dialog" onClick={onClick}>
      Hablemos de tu proyecto <span aria-hidden="true">→</span>
    </button>
  );
}

function Header({ onConsult }) {
  const [open, setOpen] = useState(false);
  const menu = useRef(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1000px)");
    function onViewportChange(event) {
      if (!event.matches) setOpen(false);
    }
    mobile.addEventListener("change", onViewportChange);
    return () => mobile.removeEventListener("change", onViewportChange);
  }, []);

  function onKeyDown(event) {
    if (event.key !== "Escape" || !open) return;
    event.preventDefault();
    setOpen(false);
    menu.current.focus();
  }

  function followSection(id) {
    if (!open) return;
    setOpen(false);
    document.getElementById(id)?.focus({ preventScroll: true });
  }

  function requestConsultation(event) {
    const trigger = open ? menu.current : event.currentTarget;
    setOpen(false);
    onConsult(trigger);
  }

  return (
    <header onKeyDown={onKeyDown}>
      <div className="container nav">
        <a href="#inicio" onClick={() => followSection("inicio")}><Brand /></a>
        <button ref={menu} className="menu" type="button" aria-controls="primary-navigation"
          aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open}
          onClick={() => setOpen((value) => !value)}>
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <nav id="primary-navigation" className={open ? "open" : ""} aria-label="Navegación principal">
          {nav.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => followSection(id)}>{label}</a>
          ))}
          <ConsultButton onClick={requestConsultation} />
        </nav>
      </div>
    </header>
  );
}

function Visual(){return <div className="visual" aria-hidden="true"><div className="orbit"/><svg viewBox="0 0 400 400"><path d="M40 210 95 90l80 95 55-130 70 125 60-80M40 210l80 110 110-70 90 90"/>{[[40,210],[95,90],[175,185],[230,55],[300,180],[360,100],[120,320],[230,250],[320,340]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r={i%2?4:7}/>)}</svg><div className="core"><b>DC</b><small>PRODUCT STUDIO</small></div></div>}
function Title({tag,children,sub}){return <div className="title"><small>{tag}</small><h2>{children}</h2>{sub&&<p>{sub}</p>}</div>}
function Footer({ onConsult }) {
  return (
    <footer>
      <div className="container foot">
        <div><b className="dc">DC</b><h3>DOBLE CÓDIGO</h3><p>{team}</p><small>Web · Apps · Software · Sistemas</small></div>
        <div>{nav.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</div>
        <div>
          <button className="footer-consult" type="button" aria-haspopup="dialog" onClick={onConsult}>Consulta de demostración</button>
          <small>Sitio de portfolio</small>
        </div>
      </div>
      <div className="container copy">© {new Date().getFullYear()} Doble Código. Sitio de demostración.</div>
    </footer>
  );
}

export default function App() {
  const [consulting, setConsulting] = useState(false);
  const opener = useRef(null);

  function openConsultation(trigger) {
    opener.current = trigger;
    setConsulting(true);
  }

  function closeConsultation() {
    setConsulting(false);
    opener.current?.focus();
  }

  function onConsult(event) {
    openConsultation(event.currentTarget);
  }

  return (
    <>
      <a className="skip" href="#main">Saltar al contenido</a>
      <Header onConsult={openConsultation} />
      <main id="main" tabIndex={-1}><section className="hero" id="inicio" tabIndex={-1}><div className="container heroGrid"><div><small className="eyebrow">WEB · APPS · SOFTWARE · SISTEMAS · DEMO</small><h1>Tecnología que transforma <em>ideas</em> en soluciones.</h1><p>Desarrollamos sitios web, aplicaciones, software y sistemas a medida para convertir ideas y necesidades reales en soluciones digitales.</p><div className="actions"><ConsultButton onClick={onConsult} /><a href="#proyectos" className="btn alt">Ver casos de demo <span aria-hidden="true">→</span></a></div><small className="strap">Web · Apps · Software · Sistemas · Automatizaciones</small></div><Visual/></div></section><section id="servicios" tabIndex={-1}><div className="container"><Title tag="LO QUE HACEMOS" sub="Desarrollamos soluciones digitales a medida.">¿Qué podemos desarrollar <em>para vos?</em></Title><div className="services">{services.map((x,i)=><article key={x[0]}><i>0{i+1}</i><span className="icon">✦</span><h3>{x[0]}</h3><p>{x[1]}</p></article>)}</div></div></section><section id="proceso" tabIndex={-1} className="dark"><div className="container"><Title tag="NUESTRO PROCESO">De una idea a <em>una solución.</em></Title><ol className="steps">{steps.map(x=><li key={x[0]}><b>{x[0]}</b><h3>{x[1]}</h3><p>{x[2]}</p></li>)}</ol></div></section><section id="proyectos" tabIndex={-1}><div className="container"><Title tag="PORTFOLIO" sub="Tres casos ficticios para mostrar cómo pensamos y diseñamos soluciones digitales.">Casos de <em>demostración</em></Title><ProjectCards /></div></section><section id="nosotras" tabIndex={-1} className="dark"><div className="container about"><div className="photo"><b>{initials[0]} <em>×</em> {initials[1]}</b><span>EQUIPO FICTICIO</span></div><div><Title tag="NOSOTRAS">Dos amigas. Dos desarrolladoras. <em>Una misma forma</em> de entender la tecnología.</Title><p>Somos {siteConfig.people[0]} y {siteConfig.people[1]}, dos desarrolladoras ficticias. Esta demo presenta nuestra forma de acompañar a negocios y empresas a transformar sus ideas en herramientas digitales.</p><b className="sign">{siteConfig.people[0]} <em>×</em> {siteConfig.people[1]}</b></div></div></section><section id="contacto" tabIndex={-1}><div className="container cta"><div><small>HAGÁMOSLO REALIDAD</small><h2>¿Tenés <em>una idea?</em></h2><p>Contanos qué necesitás y te ayudamos a transformarlo en una solución digital.</p></div><ConsultButton onClick={onConsult} /></div></section>
      </main>
      <Footer onConsult={onConsult} />
      {consulting && <Consultation onClose={closeConsultation} />}
    </>
  );
}
