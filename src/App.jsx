import { useState } from "react";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Biblioteca from "./pages/Biblioteca";
import DetalleItem from "./pages/DetalleItem";
import { useAuth } from "./hooks/useAuth";
import { useLibraryData } from "./hooks/useLibraryData";

function App() {
  const { usuario, authLoading, logout } = useAuth();
  const [pagina, setPagina] = useState("login");
  const [seccionActiva, setSeccionActiva] = useState("Inicio");
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const library = useLibraryData(usuario);

  const manejarInicioSesion = () => {
    setPagina("biblioteca");
    setSeccionActiva("Inicio");
    setItemSeleccionado(null);
  };

  const cerrarSesion = () => {
    logout();
    library.limpiarDatos();
    setPagina("login");
    setSeccionActiva("Inicio");
    setItemSeleccionado(null);
  };

  const abrirDetalle = (item) => {
    setItemSeleccionado(item);
    setPagina("detalle");
    library.registrarHistorial(item);
  };

  const volverABiblioteca = () => {
    setPagina("biblioteca");
  };

  if (authLoading) {
    return <div className="seccion">Cargando sesión...</div>;
  }

  if (usuario) {
    if (pagina === "detalle") {
      return (
        <DetalleItem
          item={itemSeleccionado}
          volver={volverABiblioteca}
          cerrarSesion={cerrarSesion}
          toggleFavorito={library.toggleFavorito}
          esFavorito={library.favoritos.some((item) => item.id === itemSeleccionado?.id)}
        />
      );
    }

    return (
      <Biblioteca
        cerrarSesion={cerrarSesion}
        abrirDetalle={abrirDetalle}
        catalogo={library.catalogo}
        categorias={library.categorias}
        favoritos={library.favoritos}
        toggleFavorito={library.toggleFavorito}
        eliminarFavorito={library.eliminarFavorito}
        eventos={library.eventos}
        inscribirEvento={library.inscribirEvento}
        cancelarInscripcion={library.cancelarInscripcion}
        historial={library.historial}
        perfil={library.perfil}
        guardarPerfil={library.guardarPerfil}
        crearCategoria={library.crearCategoria}
        actualizarCategoria={library.actualizarCategoria}
        eliminarCategoria={library.eliminarCategoria}
        crearLibro={library.crearLibro}
        actualizarLibro={library.actualizarLibro}
        eliminarLibro={library.eliminarLibro}
        crearEvento={library.crearEvento}
        actualizarEvento={library.actualizarEvento}
        eliminarEvento={library.eliminarEvento}
        eliminarHistorial={library.eliminarHistorial}
        loading={library.loading}
        error={library.error}
        onDismissError={() => library.setError("")}
        seccionActiva={seccionActiva}
        setSeccionActiva={setSeccionActiva}
      />
    );
  }

  if (pagina === "registro") {
    return <Registro cambiarPagina={setPagina} />;
  }

  return <Login cambiarPagina={setPagina} iniciarSesion={manejarInicioSesion} />;
}

export default App;
