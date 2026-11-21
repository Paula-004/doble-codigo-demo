import { useEffect, useRef, useState } from "react";
import { services } from "../data/content";

const types = services.map(([name]) => name);
const goals = ["Presentar un negocio", "Organizar un proceso", "Automatizar una tarea", "Explorar una idea"];

export default function Consultation({ onClose }) {
  const dialog = useRef(null);
  const typeField = useRef(null);
  const previewTitle = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    typeField.current.focus();
    return () => element.close();
  }, []);

  useEffect(() => {
    if (preview) previewTitle.current?.focus();
  }, [preview]);

  function close() {
    dialog.current.close();
    onClose();
  }

  function prepare(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const type = form.get("type");
    const goal = form.get("goal");
    if (!types.includes(type) || !goals.includes(goal)) return;
    setPreview({ type, goal });
  }

  return (
    <dialog ref={dialog} className="consultation-dialog" aria-labelledby="consultation-title" aria-describedby="consultation-help"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (event.target === dialog.current) close(); }}>
      <div className="consultation-content">
        <button className="consultation-close" type="button" onClick={close} aria-label="Cerrar consulta">×</button>
        <p className="eyebrow">DEMOSTRACIÓN</p>
        <h2 id="consultation-title">Prepará una consulta</h2>
        <p id="consultation-help">Elegí dos opciones de ejemplo para ver un borrador. La demo no pide datos personales.</p>
        <form method="dialog" onSubmit={prepare} onChange={() => setPreview(null)}>
          <label>Tipo de proyecto
            <select ref={typeField} name="type" required defaultValue="">
              <option value="">Elegí un tipo de proyecto</option>
              {types.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>Objetivo
            <select name="goal" required defaultValue="">
              <option value="">Elegí un objetivo de ejemplo</option>
              {goals.map((goal) => <option key={goal}>{goal}</option>)}
            </select>
          </label>
          <button className="btn" type="submit">Ver vista previa</button>
        </form>
        {preview && (
          <section className="consultation-preview" aria-labelledby="preview-title">
            <h3 id="preview-title" ref={previewTitle} tabIndex={-1}>Vista previa de la consulta</h3>
            <p>Hola, Doble Código. Quisiera explorar un proyecto de {preview.type}.</p>
            <p>Objetivo: {preview.goal}.</p>
            <small>Borrador de demostración. No se envía ni se guarda.</small>
          </section>
        )}
      </div>
    </dialog>
  );
}
