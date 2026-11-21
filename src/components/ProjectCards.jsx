import { projects } from "../data/projects";

function Vitrina() {
  return (
    <div className="project-screen storefront">
      <div className="screen-bar"><span>Vitrina digital</span><i /><i /></div>
      <div className="storefront-body">
        <div><b>Servicios a tu alcance</b><span>Encontrá lo que necesitás.</span><strong>Ver servicios</strong></div>
        <div className="storefront-pattern"><i /><i /><i /></div>
      </div>
      <div className="storefront-items"><i /><i /><i /></div>
    </div>
  );
}

function Agenda() {
  return (
    <div className="project-screen agenda">
      <b>Elegí una fecha</b>
      <div className="agenda-days">
        {["Lun", "Mar", "Mié", "Jue", "Vie"].map((day, index) => (
          <span key={day} className={index === 2 ? "selected" : undefined}>{day}<b>{12 + index}</b></span>
        ))}
      </div>
      <div className="agenda-times"><span>09:30</span><span className="selected">11:00</span><span>14:30</span></div>
      <small>Horario seleccionado · 11:00</small>
    </div>
  );
}

const stock = [
  ["Cuaderno", "8", "Bajo"],
  ["Caja mediana", "24", "Disponible"],
  ["Etiquetas", "0", "Agotado"],
];

function Inventario() {
  return (
    <div className="project-screen inventory">
      <div className="screen-bar"><span>Inventario</span><i /><i /></div>
      <div className="inventory-stats"><span><b>32</b> Unidades</span><span><b>2</b> Alertas</span></div>
      <div className="inventory-rows">
        {stock.map(([name, quantity, status]) => (
          <div key={name}><span>{name}</span><b>{quantity}</b><span>{status}</span></div>
        ))}
      </div>
    </div>
  );
}

const visuals = { vitrina: Vitrina, agenda: Agenda, inventario: Inventario };

export default function ProjectCards() {
  return (
    <div className="projects">
      {projects.map((project) => {
        const Visual = visuals[project.id];
        return (
          <article className="project-card" key={project.id}>
            <div className={`project-visual project-visual--${project.id}`} aria-hidden="true"><Visual /></div>
            <div className="projectText">
              <small>{project.category}</small>
              <h3>{project.name}</h3>
              <dl className="project-brief">
                <div><dt>Desafío</dt><dd>{project.challenge}</dd></div>
                <div><dt>Enfoque</dt><dd>{project.approach}</dd></div>
              </dl>
              <ul className="project-tags" aria-label="Aspectos de diseño">
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            </div>
          </article>
        );
      })}
    </div>
  );
}
