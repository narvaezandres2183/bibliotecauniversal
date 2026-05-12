import "../../styles/components/CategoryCard.css";

function CategoryCard({ category, total, isActive, onSelect }) {
  return (
    <button
      className={`card categoria-card ${isActive ? "categoria-activa" : ""}`}
      onClick={() => onSelect(category)}
    >
      <h3>{category}</h3>
      <p>{total} disponibles</p>
    </button>
  );
}

export default CategoryCard;
