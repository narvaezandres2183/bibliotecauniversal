import { useState } from "react";
import CatalogCard from "../common/CatalogCard";
import "../../styles/sections/CatalogSection.css";

function CatalogSection({
  items,
  categorias,
  onOpenDetail,
  onToggleFavorite,
  isFavorite,
  onCreateBook,
  onUpdateBook,
  onDeleteBook
}) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    pages: "",
    categoryId: ""
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({ titulo: "", autor: "", pages: "", categoryId: "" });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      titulo: item.titulo,
      autor: item.autor,
      pages: item.pages || "",
      categoryId: item.categoryId || categorias[0]?.id || ""
    });
  };

  const submitBook = async (e) => {
    e.preventDefault();
    if (!form.categoryId) {
      return;
    }

    if (editingId) {
      await onUpdateBook(editingId, form);
    } else {
      await onCreateBook(form);
    }
    resetForm();
  };

  const itemsFiltrados = items.filter((item) => {
    const cumpleTexto = `${item.titulo} ${item.autor} ${item.descripcion}`
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const cumpleTipo = filtroTipo === "Todos" || item.tipo === filtroTipo;
    const cumpleCategoria =
      filtroCategoria === "Todas" || item.categoria === filtroCategoria;
    return cumpleTexto && cumpleTipo && cumpleCategoria;
  });

  return (
    <section className="seccion">
      <h2>Catalogo principal</h2>
      <form className="gestion-form" onSubmit={submitBook}>
        <input
          type="text"
          placeholder="Titulo"
          value={form.titulo}
          onChange={(e) => setForm((actual) => ({ ...actual, titulo: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Autor"
          value={form.autor}
          onChange={(e) => setForm((actual) => ({ ...actual, autor: e.target.value }))}
          required
        />
        <input
          type="number"
          min="1"
          placeholder="Paginas"
          value={form.pages}
          onChange={(e) => setForm((actual) => ({ ...actual, pages: e.target.value }))}
          required
        />
        <select
          value={form.categoryId}
          onChange={(e) => setForm((actual) => ({ ...actual, categoryId: e.target.value }))}
          required
        >
          <option value="">Categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        <button type="submit">{editingId ? "Actualizar libro" : "Crear libro"}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por titulo, autor o descripcion"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="Todos">Tipo: Todos</option>
          <option value="Libro">Libro</option>
          <option value="Comic">Comic</option>
          <option value="Exposicion">Exposicion</option>
        </select>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="Todas">Categoria: Todas</option>
          {Array.from(new Set(items.map((item) => item.categoria))).map(
            (categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            )
          )}
        </select>
      </div>
      {itemsFiltrados.length === 0 && <p>No se encontraron resultados.</p>}
      <div className="grid">
        {itemsFiltrados.map((item) => (
          <CatalogCard
            key={item.id}
            item={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenDetail={onOpenDetail}
            onEdit={startEdit}
            onDelete={onDeleteBook}
          />
        ))}
      </div>
    </section>
  );
}

export default CatalogSection;
