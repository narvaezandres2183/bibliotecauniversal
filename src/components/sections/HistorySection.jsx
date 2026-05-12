import { useMemo } from "react";
import StatisticCard from "../common/StatisticCard";
import "../../styles/sections/HistorySection.css";

function HistorySection({ historial, onDeleteHistory }) {
  const estadisticas = useMemo(() => {
    const ahora = new Date();
    const haceSieteDias = new Date(ahora);
    haceSieteDias.setDate(ahora.getDate() - 7);

    const visitadosSemana = historial.filter(
      (item) => new Date(item.fechaISO) >= haceSieteDias
    ).length;

    const conteoCategorias = historial.reduce((acumulado, item) => {
      acumulado[item.categoria] = (acumulado[item.categoria] || 0) + 1;
      return acumulado;
    }, {});

    const categoriaMasVisitada =
      Object.entries(conteoCategorias).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Sin datos";

    return {
      totalVisitados: historial.length,
      visitadosSemana,
      categoriaMasVisitada
    };
  }, [historial]);

  return (
    <section className="seccion">
      <h2>Historial de lectura</h2>
      <div className="grid estadisticas-grid">
        <StatisticCard
          title="Total visitados"
          value={estadisticas.totalVisitados}
        />
        <StatisticCard
          title="Visitados esta semana"
          value={estadisticas.visitadosSemana}
        />
        <StatisticCard
          title="Categoría más visitada"
          value={estadisticas.categoriaMasVisitada}
        />
      </div>

      {historial.length === 0 && (
        <p>Aún no has visitado libros o exposiciones.</p>
      )}
      <div className="detalle">
        {historial.map((registro) => (
          <div className="historial-item" key={registro.id}>
            <p>
              <strong>{registro.titulo}</strong> ({registro.tipo}) -{" "}
              {new Date(registro.fechaISO).toLocaleString("es-CO")}
            </p>
            <button
              type="button"
              className="danger"
              onClick={() => onDeleteHistory(registro.itemId)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HistorySection;
