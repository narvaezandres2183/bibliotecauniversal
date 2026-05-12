import { useMemo, useState } from "react";
import CategoryCard from "../common/CategoryCard";
import CatalogCard from "../common/CatalogCard";
import "../../styles/sections/CategoriesSection.css";

function CategoriesSection({
  items,
  categorias,
  onOpenDetail,
  onToggleFavorite,
  isFavorite,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory
}) {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [editingId, setEditingId] = useState(null);
  const [nombre, setNombre] = useState("");

  const categoriasBase = useMemo(() => {
    if (categorias.length) {
      return categorias.map((categoria) => ({
        ...categoria,
        total:
          categoria.total ||
          items.filter((item) => item.categoria === categoria.nombre).length
      }));
    }

    return [...new Set(items.map((item) => item.categoria))].map((categoryName) => ({
      id: categoryName,
      nombre: categoryName,
      total: items.filter((item) => item.categoria === categoryName).length
    }));
  }, [categorias, items]);

  const itemsFiltrados = useMemo(() => {
    if (categoriaActiva === "Todas") {
      return items;
    }
    return items.filter((item) => item.categoria === categoriaActiva);
  }, [items, categoriaActiva]);

  const resetForm = () => {
    setEditingId(null);
    setNombre("");
  };

  const submitCategory = async (e) => {
    e.preventDefault();
    if (editingId) {
      await onUpdateCategory(editingId, { nombre });
    } else {
      await onCreateCategory({ nombre });
    }
    resetForm();
  };

  return (
    <section className="seccion">
      <h2>Sistema de categorias</h2>
      <form className="gestion-form" onSubmit={submitCategory}>
        <input
          type="text"
          placeholder="Nombre de categoria"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <button type="submit">
          {editingId ? "Actualizar categoria" : "Crear categoria"}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancelar
          </button>
        )}
      </form>

      <div className="grid">
        <CategoryCard
          category="Todas"
          total={items.length}
          isActive={categoriaActiva === "Todas"}
          onSelect={() => setCategoriaActiva("Todas")}
        />
        {categoriasBase.map((categoria) => (
          <div className="gestion-card" key={categoria.id}>
            <CategoryCard
              category={categoria.nombre}
              total={categoria.total}
              isActive={categoriaActiva === categoria.nombre}
              onSelect={() => setCategoriaActiva(categoria.nombre)}
            />
            <div className="card-acciones">
              <button
                type="button"
                onClick={() => {
                  setEditingId(categoria.id);
                  setNombre(categoria.nombre);
                }}
              >
                Editar
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => onDeleteCategory(categoria.id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="subtitulo-seccion">Contenido filtrado: {categoriaActiva}</h3>
      {itemsFiltrados.length === 0 && <p>No hay contenido en esta categoria.</p>}
      <div className="grid">
        {itemsFiltrados.map((item) => (
          <CatalogCard
            key={item.id}
            item={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={onToggleFavorite}
            onOpenDetail={onOpenDetail}
          />
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;
