import "../../styles/components/CatalogCard.css";

function CatalogCard({
  item,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onEdit,
  onDelete
}) {
  return (
    <article className="card catalogo-card">
      <button
        className={`favorito-btn ${isFavorite ? "activo" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(item);
        }}
        title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        ♥
      </button>
      <button
        className="card-boton card-link"
        onClick={() => onOpenDetail(item)}
      >
        <div className="card-top">
          <h3>{item.titulo}</h3>
        </div>
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
      {(onEdit || onDelete) && (
        <div className="card-acciones">
          {onEdit && (
            <button type="button" onClick={() => onEdit(item)}>
              Editar
            </button>
          )}
          {onDelete && (
            <button type="button" className="danger" onClick={() => onDelete(item.id)}>
              Eliminar
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default CatalogCard;
