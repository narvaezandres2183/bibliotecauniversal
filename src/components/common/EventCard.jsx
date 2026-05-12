import "../../styles/components/EventCard.css";

function EventCard({
  evento,
  onSubscribe,
  onCancel,
  isSubscribed,
  isCancelable,
  onEdit,
  onDelete
}) {
  const disponibles = evento.cupoTotal - evento.inscritos;
  const ultimosCupos = disponibles > 0 && disponibles <= 5;

  return (
    <article className="card evento-card">
      <h3>{evento.titulo}</h3>
      <p>{evento.descripcion}</p>
      <p>
        <strong>Fecha:</strong> {evento.fecha}
      </p>
      <p>
        <strong>Hora:</strong> {evento.hora}
      </p>
      <p>
        <strong>Lugar:</strong> {evento.lugar}
      </p>
      <p>
        <strong>Moderador:</strong> {evento.moderador}
      </p>
      <p>
        <strong>Cupos:</strong> {disponibles}/{evento.cupoTotal} disponibles
      </p>
      {ultimosCupos && <span className="tag tag-alerta">Últimos cupos</span>}
      {isCancelable ? (
        <button
          className="evento-accion cancelar"
          onClick={() => onCancel(evento.id)}
        >
          Cancelar inscripción
        </button>
      ) : (
        <button
          className={`evento-accion ${isSubscribed ? "ya-inscrito" : ""}`}
          onClick={() => onSubscribe(evento.id)}
          disabled={isSubscribed || disponibles <= 0}
        >
          {isSubscribed ? "✓ Ya inscrito" : "Inscribirse"}
        </button>
      )}
      {(onEdit || onDelete) && (
        <div className="card-acciones">
          {onEdit && (
            <button type="button" onClick={() => onEdit(evento)}>
              Editar
            </button>
          )}
          {onDelete && (
            <button type="button" className="danger" onClick={() => onDelete(evento.id)}>
              Eliminar
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default EventCard;
