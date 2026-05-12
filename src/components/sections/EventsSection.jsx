import { useState } from "react";
import EventCard from "../common/EventCard";
import "../../styles/sections/EventsSection.css";

const initialEvent = {
  titulo: "",
  descripcion: "",
  fecha: "",
  hora: "",
  lugar: "",
  moderador: "",
  cupoTotal: 30
};

function EventsSection({
  eventos,
  onSubscribe,
  onCancel,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent
}) {
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialEvent);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialEvent);
  };

  const startEdit = (evento) => {
    setEditingId(evento.id);
    setForm({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      hora: evento.hora,
      lugar: evento.lugar,
      moderador: evento.moderador,
      cupoTotal: evento.cupoTotal || 30
    });
  };

  const submitEvent = async (e) => {
    e.preventDefault();
    if (editingId) {
      await onUpdateEvent(editingId, form);
    } else {
      await onCreateEvent(form);
    }
    resetForm();
  };

  return (
    <section className="seccion">
      <h2>Eventos y actividades</h2>
      <form className="gestion-form gestion-form-largo" onSubmit={submitEvent}>
        <input
          type="text"
          placeholder="Nombre"
          value={form.titulo}
          onChange={(e) => setForm((actual) => ({ ...actual, titulo: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Descripcion"
          value={form.descripcion}
          onChange={(e) => setForm((actual) => ({ ...actual, descripcion: e.target.value }))}
        />
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => setForm((actual) => ({ ...actual, fecha: e.target.value }))}
          required
        />
        <input
          type="time"
          value={form.hora}
          onChange={(e) => setForm((actual) => ({ ...actual, hora: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Lugar"
          value={form.lugar}
          onChange={(e) => setForm((actual) => ({ ...actual, lugar: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Moderador"
          value={form.moderador}
          onChange={(e) => setForm((actual) => ({ ...actual, moderador: e.target.value }))}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Cupos"
          value={form.cupoTotal}
          onChange={(e) => setForm((actual) => ({ ...actual, cupoTotal: e.target.value }))}
          required
        />
        <button type="submit">{editingId ? "Actualizar evento" : "Crear evento"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      <div className="grid">
        {eventos.map((evento) => (
          <EventCard
            key={evento.id}
            evento={evento}
            isSubscribed={evento.inscrito}
            onSubscribe={onSubscribe}
            onCancel={onCancel}
            isCancelable={false}
            onEdit={startEdit}
            onDelete={onDeleteEvent}
          />
        ))}
      </div>
    </section>
  );
}

export default EventsSection;
