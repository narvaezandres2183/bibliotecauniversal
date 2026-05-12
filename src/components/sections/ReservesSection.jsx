import EventCard from "../common/EventCard";
import "../../styles/sections/ReservesSection.css";

function ReservesSection({ eventosInscritos, onCancel }) {
  return (
    <section className="seccion">
      <h2>Eventos inscritos</h2>
      {eventosInscritos.length === 0 && <p>No tienes reservas activas.</p>}
      <div className="grid">
        {eventosInscritos.map((evento) => (
          <EventCard
            key={evento.id}
            evento={evento}
            onCancel={onCancel}
            isCancelable={true}
          />
        ))}
      </div>
    </section>
  );
}

export default ReservesSection;
