import "../../styles/sections/FavoritesSection.css";

function FavoritesSection({
  favoritos,
  onOpenDetail,
  onDeleteFavorite
}) {
  return (
    <section className="seccion">
      <h2>Favoritos</h2>
      {favoritos.length === 0 && <p>No tienes elementos guardados.</p>}
      <div className="grid">
        {favoritos.map((item) => (
          <article key={item.id} className="card catalogo-card">
            <button
              className="card-boton card-link"
              onClick={() => onOpenDetail(item)}
            >
              <h3>{item.titulo}</h3>
              <p>{item.autor}</p>
              <div className="tags">
                <span
                  className={`tag ${
                    item.tipo === "Exposición" ? "tag-expo" : "tag-libro"
                  }`}
                >
                  {item.tipo}
                </span>
                <span className="tag tag-categoria">{item.categoria}</span>
              </div>
            </button>
            <button
              className="eliminar-btn"
              title="Eliminar de favoritos"
              onClick={() => onDeleteFavorite(item.id)}
            >
              ×
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FavoritesSection;
