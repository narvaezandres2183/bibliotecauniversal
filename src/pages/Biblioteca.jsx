import MainLayout from "../components/layout/MainLayout";
import CatalogSection from "../components/sections/CatalogSection";
import CategoriesSection from "../components/sections/CategoriesSection";
import EventsSection from "../components/sections/EventsSection";
import FavoritesSection from "../components/sections/FavoritesSection";
import ReservesSection from "../components/sections/ReservesSection";
import HistorySection from "../components/sections/HistorySection";
import ProfileSection from "../components/sections/ProfileSection";

function Biblioteca({
  cerrarSesion,
  abrirDetalle,
  catalogo,
  categorias,
  favoritos,
  toggleFavorito,
  eliminarFavorito,
  eventos,
  inscribirEvento,
  cancelarInscripcion,
  historial,
  perfil,
  guardarPerfil,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  crearLibro,
  actualizarLibro,
  eliminarLibro,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  eliminarHistorial,
  loading,
  error,
  onDismissError,
  seccionActiva,
  setSeccionActiva
}) {
  const eventosInscritos = eventos.filter((evento) => evento.inscrito);
  const isFavorite = (id) => favoritos.some((item) => item.id === id);

  const renderSeccion = () => {
    switch (seccionActiva) {
      case "Inicio":
        return (
          <CatalogSection
            items={catalogo}
            categorias={categorias}
            onOpenDetail={abrirDetalle}
            onToggleFavorite={toggleFavorito}
            isFavorite={isFavorite}
            onCreateBook={crearLibro}
            onUpdateBook={actualizarLibro}
            onDeleteBook={eliminarLibro}
          />
        );

      case "Categorías":
        return (
          <CategoriesSection
            items={catalogo}
            categorias={categorias}
            onOpenDetail={abrirDetalle}
            onToggleFavorite={toggleFavorito}
            isFavorite={isFavorite}
            onCreateCategory={crearCategoria}
            onUpdateCategory={actualizarCategoria}
            onDeleteCategory={eliminarCategoria}
          />
        );

      case "Eventos":
        return (
          <EventsSection
            eventos={eventos}
            onSubscribe={inscribirEvento}
            onCancel={cancelarInscripcion}
            onCreateEvent={crearEvento}
            onUpdateEvent={actualizarEvento}
            onDeleteEvent={eliminarEvento}
          />
        );

      case "Favoritos":
        return (
          <FavoritesSection
            favoritos={favoritos}
            onOpenDetail={abrirDetalle}
            onDeleteFavorite={eliminarFavorito}
          />
        );

      case "Reservas":
        return (
          <ReservesSection
            eventosInscritos={eventosInscritos}
            onCancel={cancelarInscripcion}
          />
        );

      case "Historial":
        return <HistorySection historial={historial} onDeleteHistory={eliminarHistorial} />;

      case "Perfil":
        return (
          <ProfileSection
            perfil={perfil}
            onProfileChange={guardarPerfil}
          />
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout
      activeSection={seccionActiva}
      onSectionChange={setSeccionActiva}
      onLogout={cerrarSesion}
    >
      {loading && <p className="seccion">Cargando biblioteca...</p>}
      {error && (
        <div className="seccion">
          <div className="detalle">
            <p>{error}</p>
            <button onClick={onDismissError}>Cerrar</button>
          </div>
        </div>
      )}
      {renderSeccion()}
    </MainLayout>
  );
}

export default Biblioteca;
