import Header from "../common/Header";
import "../../styles/layout/AuthLayout.css";

function AuthLayout({ children }) {
  return (
    <div className="contenedor">
      <h1 className="titulo-principal">Biblioteca Universal</h1>
      <p className="subtitulo">Sistema de gestión de libros</p>
      {children}
    </div>
  );
}

export default AuthLayout;
