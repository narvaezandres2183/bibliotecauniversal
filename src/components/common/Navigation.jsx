import "../../styles/components/Navigation.css";

const SECTIONS = [
  "Inicio",
  "Categorías",
  "Eventos",
  "Favoritos",
  "Reservas",
  "Historial",
  "Perfil"
];

function Navigation({ activeSection, onSectionChange }) {
  return (
    <nav className="nav-principal">
      {SECTIONS.map((section) => (
        <button
          key={section}
          className={`nav-item ${activeSection === section ? "activo" : ""}`}
          onClick={() => onSectionChange(section)}
        >
          {section}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
