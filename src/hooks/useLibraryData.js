import { useCallback, useEffect, useMemo, useState } from "react";
import { booksService } from "../services/books.service";
import { eventsService } from "../services/events.service";
import { favoritesService } from "../services/favorites.service";
import { historyService } from "../services/history.service";
import { usersService } from "../services/users.service";

const initialProfile = {
  nombre: "",
  correo: "",
  biografia: "",
  notificacionesEmail: true,
  nivel: "Principiante"
};

const enrichBookRefs = (records, books) => {
  const booksById = new Map(books.map((book) => [book.id, book]));

  return records.map((record) => {
    const bookId = record.itemId ?? record.bookId ?? record.id;
    const book = booksById.get(bookId);
    return book
      ? {
          ...book,
          ...record,
          id: book.id,
          itemId: book.id,
          titulo: book.titulo,
          tipo: book.tipo,
          categoria: book.categoria
        }
      : record;
  });
};

export function useLibraryData(usuario) {
  const [catalogo, setCatalogo] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [perfil, setPerfil] = useState(() => ({
    ...initialProfile,
    ...usuario
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reservas = useMemo(
    () => eventos.filter((evento) => evento.inscrito),
    [eventos]
  );

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [
        booksData,
        categoriesData,
        favoritesData,
        eventsData,
        historyData
      ] = await Promise.all([
        booksService.getBooks(),
        booksService.getCategories(),
        favoritesService.getFavorites(),
        eventsService.getEvents(),
        historyService.getHistory()
      ]);

      setCatalogo(booksData);
      setCategorias(categoriesData);
      setFavoritos(enrichBookRefs(favoritesData, booksData));
      setEventos(eventsData);
      setHistorial(enrichBookRefs(historyData, booksData));
    } catch (err) {
      setError(err.message || "No se pudo cargar la biblioteca.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!usuario) {
      return;
    }

    setPerfil({ ...initialProfile, ...usuario });
    cargarDatos();
  }, [cargarDatos, usuario]);

  const toggleFavorito = useCallback(async (item) => {
    const existe = favoritos.some((favorito) => favorito.id === item.id);
    const anterior = favoritos;
    const siguiente = existe
      ? favoritos.filter((favorito) => favorito.id !== item.id)
      : [...favoritos, item];

    setFavoritos(siguiente);
    try {
      if (existe) {
        await favoritesService.removeFavorite(
          favoritos.find((favorito) => favorito.id === item.id) ?? item
        );
      } else {
        await favoritesService.addFavorite(item);
      }
    } catch (err) {
      setFavoritos(anterior);
      setError(err.message || "No se pudo actualizar favoritos.");
    }
  }, [favoritos]);

  const eliminarFavorito = useCallback(async (itemId) => {
    const item = favoritos.find((favorito) => favorito.id === itemId);
    if (item) {
      await toggleFavorito(item);
    }
  }, [favoritos, toggleFavorito]);

  const registrarHistorial = useCallback(async (item) => {
    try {
      const record = await historyService.addHistory(item);
      setHistorial((actual) => [
        record,
        ...actual.filter((entry) => entry.itemId !== item.id)
      ]);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el historial.");
    }
  }, []);

  const eliminarHistorial = useCallback(async (itemId) => {
    const anterior = historial;
    setHistorial((actual) => actual.filter((entry) => entry.itemId !== itemId));

    try {
      await historyService.removeHistory(itemId);
    } catch (err) {
      setHistorial(anterior);
      setError(err.message || "No se pudo eliminar del historial.");
    }
  }, [historial]);

  const inscribirEvento = useCallback(async (eventoId) => {
    const evento = eventos.find((item) => item.id === eventoId);
    if (!evento || evento.inscrito || evento.cupoTotal - evento.inscritos <= 0) {
      return;
    }

    const anterior = eventos;
    setEventos((actual) =>
      actual.map((item) =>
        item.id === eventoId
          ? { ...item, inscrito: true, inscritos: item.inscritos + 1 }
          : item
      )
    );

    try {
      await eventsService.reserve(evento);
    } catch (err) {
      setEventos(anterior);
      setError(err.message || "No se pudo reservar el evento.");
    }
  }, [eventos]);

  const cancelarInscripcion = useCallback(async (eventoId) => {
    const evento = eventos.find((item) => item.id === eventoId);
    if (!evento || !evento.inscrito) {
      return;
    }

    const anterior = eventos;
    setEventos((actual) =>
      actual.map((item) =>
        item.id === eventoId
          ? { ...item, inscrito: false, inscritos: Math.max(0, item.inscritos - 1) }
          : item
      )
    );

    try {
      await eventsService.cancel(evento);
    } catch (err) {
      setEventos(anterior);
      setError(err.message || "No se pudo cancelar la reserva.");
    }
  }, [eventos]);

  const guardarPerfil = useCallback(async (nuevoPerfil) => {
    const anterior = perfil;
    setPerfil(nuevoPerfil);

    try {
      const perfilGuardado = await usersService.updateProfile(nuevoPerfil);
      setPerfil((actual) => ({ ...actual, ...perfilGuardado }));
    } catch (err) {
      setPerfil(anterior);
      setError(err.message || "No se pudo guardar el perfil.");
    }
  }, [perfil]);

  const crearCategoria = useCallback(async (categoria) => {
    try {
      const creada = await booksService.createCategory(categoria);
      setCategorias((actual) => [...actual, creada]);
      return creada;
    } catch (err) {
      setError(err.message || "No se pudo crear la categoria.");
      throw err;
    }
  }, []);

  const actualizarCategoria = useCallback(async (categoryId, categoria) => {
    try {
      const actualizada = await booksService.updateCategory(categoryId, categoria);
      setCategorias((actual) =>
        actual.map((item) => (String(item.id) === String(categoryId) ? actualizada : item))
      );
      return actualizada;
    } catch (err) {
      setError(err.message || "No se pudo actualizar la categoria.");
      throw err;
    }
  }, []);

  const eliminarCategoria = useCallback(async (categoryId) => {
    try {
      await booksService.deleteCategory(categoryId);
      setCategorias((actual) => actual.filter((item) => String(item.id) !== String(categoryId)));
    } catch (err) {
      setError(err.message || "No se pudo eliminar la categoria.");
      throw err;
    }
  }, []);

  const crearLibro = useCallback(async (book) => {
    try {
      const creado = await booksService.createBook(book);
      setCatalogo((actual) => [...actual, creado]);
      return creado;
    } catch (err) {
      setError(err.message || "No se pudo crear el libro.");
      throw err;
    }
  }, []);

  const actualizarLibro = useCallback(async (bookId, book) => {
    try {
      const actualizado = await booksService.updateBook(bookId, book);
      setCatalogo((actual) =>
        actual.map((item) => (item.id === bookId ? { ...item, ...actualizado } : item))
      );
      return actualizado;
    } catch (err) {
      setError(err.message || "No se pudo actualizar el libro.");
      throw err;
    }
  }, []);

  const eliminarLibro = useCallback(async (bookId) => {
    try {
      await booksService.deleteBook(bookId);
      setCatalogo((actual) => actual.filter((item) => item.id !== bookId));
      setFavoritos((actual) => actual.filter((item) => item.id !== bookId));
      setHistorial((actual) => actual.filter((item) => item.itemId !== bookId));
    } catch (err) {
      setError(err.message || "No se pudo eliminar el libro.");
      throw err;
    }
  }, []);

  const crearEvento = useCallback(async (event) => {
    try {
      const creado = await eventsService.createEvent(event);
      setEventos((actual) => [...actual, creado]);
      return creado;
    } catch (err) {
      setError(err.message || "No se pudo crear el evento.");
      throw err;
    }
  }, []);

  const actualizarEvento = useCallback(async (eventId, event) => {
    try {
      const actualizado = await eventsService.updateEvent(eventId, event);
      setEventos((actual) =>
        actual.map((item) => (item.id === eventId ? { ...item, ...actualizado } : item))
      );
      return actualizado;
    } catch (err) {
      setError(err.message || "No se pudo actualizar el evento.");
      throw err;
    }
  }, []);

  const eliminarEvento = useCallback(async (eventId) => {
    try {
      await eventsService.deleteEvent(eventId);
      setEventos((actual) => actual.filter((item) => item.id !== eventId));
    } catch (err) {
      setError(err.message || "No se pudo eliminar el evento.");
      throw err;
    }
  }, []);

  const limpiarDatos = useCallback(() => {
    setCatalogo([]);
    setCategorias([]);
    setFavoritos([]);
    setEventos([]);
    setHistorial([]);
    setPerfil(initialProfile);
    setError("");
  }, []);

  return {
    catalogo,
    categorias,
    favoritos,
    eventos,
    reservas,
    historial,
    perfil,
    loading,
    error,
    setError,
    toggleFavorito,
    eliminarFavorito,
    registrarHistorial,
    eliminarHistorial,
    inscribirEvento,
    cancelarInscripcion,
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
    limpiarDatos,
    recargarDatos: cargarDatos
  };
}
