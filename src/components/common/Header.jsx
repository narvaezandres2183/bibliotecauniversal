import "../../styles/components/Header.css";

function Header({ onLogout }) {
  return (
    <div className="header">
      <h1>Biblioteca Universal</h1>
      <button onClick={onLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Header;
