const unwrapList = (data, keys = []) => {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
};

export const normalizeUser = (user = {}) => ({
  id: user.id ?? user.user_id ?? user.uid ?? null,
  nombre: user.nombre ?? user.name ?? user.full_name ?? "",
  correo: user.correo ?? user.email ?? "",
  biografia: user.biografia ?? user.bio ?? "",
  notificacionesEmail:
    user.notificacionesEmail ?? user.email_notifications ?? true,
  nivel: user.nivel ?? user.level ?? "Principiante"
});

export const normalizeBook = (book = {}) => ({
  id: String(book.id ?? book.book_id ?? book.item_id ?? crypto.randomUUID()),
  titulo: book.titulo ?? book.title ?? "Sin título",
  tipo: book.tipo ?? book.type ?? "Libro",
  categoria:
    book.categoria ?? book.category?.nombre ?? book.category?.name ?? book.category ?? "General",
  autor: book.autor ?? book.author ?? "Autor no especificado",
  anio: String(book.anio ?? book.year ?? book.published_year ?? ""),
  idiomas: Array.isArray(book.idiomas ?? book.languages)
    ? (book.idiomas ?? book.languages).join(", ")
    : book.idiomas ?? book.languages ?? "",
  publicadoPor: book.publicadoPor ?? book.publisher ?? book.published_by ?? "",
  descripcion: book.descripcion ?? book.description ?? "",
  pages: book.pages ?? book.paginas ?? 0,
  categoryId: book.category_id ?? book.category?.id ?? null,
  createdAt: book.created_at ?? null
});

export const normalizeBooks = (data) =>
  unwrapList(data, ["books", "items", "results", "data"]).map(normalizeBook);

export const normalizeCategory = (category = {}) => ({
  id: category.id ?? category.category_id ?? category.nombre ?? category.name,
  nombre: category.nombre ?? category.name ?? String(category),
  total: category.total ?? category.count ?? category.books_count ?? 0
});

export const normalizeCategories = (data) =>
  unwrapList(data, ["categories", "results", "data"]).map(normalizeCategory);

export const normalizeFavorite = (favorite = {}) => {
  const item = favorite.book ?? favorite.item ?? favorite;
  const bookId = favorite.book_id ?? item.id ?? item.book_id;
  return {
    ...normalizeBook({ ...item, id: bookId }),
    favoriteId: bookId,
    bookId: String(bookId ?? "")
  };
};

export const normalizeFavorites = (data) =>
  unwrapList(data, ["favorites", "items", "results", "data"]).map(normalizeFavorite);

export const normalizeHistoryItem = (item = {}) => {
  const book = item.book ?? item.item ?? item;
  return {
    id: String(item.id ?? item.history_id ?? `${book.id ?? book.book_id}-${item.created_at ?? Date.now()}`),
    itemId: String(item.itemId ?? item.book_id ?? book.id ?? book.book_id ?? ""),
    titulo: item.titulo ?? book.titulo ?? book.title ?? "Sin título",
    tipo: item.tipo ?? book.tipo ?? book.type ?? "Libro",
    categoria:
      item.categoria ?? book.categoria ?? book.category?.nombre ?? book.category?.name ?? "General",
    fechaISO: item.fechaISO ?? item.created_at ?? item.visited_at ?? new Date().toISOString()
  };
};

export const normalizeHistory = (data) =>
  unwrapList(data, ["history", "items", "results", "data"]).map(normalizeHistoryItem);

export const normalizeEvent = (event = {}, reservationIds = new Set()) => {
  const id = String(event.id ?? event.event_id ?? "");
  const cupoTotal = Number(event.cupoTotal ?? event.capacity ?? event.total_capacity ?? 0);
  const inscritos = Number(event.inscritos ?? event.registered ?? event.reserved_count ?? 0);

  return {
    id,
    titulo: event.titulo ?? event.name ?? event.title ?? "Evento sin título",
    descripcion: event.descripcion ?? event.description ?? "",
    fecha: event.fecha ?? event.date ?? event.event_date ?? "",
    hora: event.hora ?? event.time ?? event.event_time ?? "",
    lugar: event.lugar ?? event.place ?? event.location ?? "",
    moderador: event.moderador ?? event.host ?? event.moderator ?? "",
    cupoTotal,
    inscritos,
    inscrito: Boolean(event.inscrito ?? event.is_reserved ?? reservationIds.has(id)),
    reservationId: event.reservationId ?? event.reservation_id ?? null
  };
};

export const normalizeEvents = (data, reservationIds = new Set()) =>
  unwrapList(data, ["events", "items", "results", "data"]).map((event) =>
    normalizeEvent(event, reservationIds)
  );

export const normalizeReservation = (reservation = {}) => {
  const event = reservation.event ?? {};
  return {
    id: reservation.id ?? reservation.reservation_id ?? null,
    eventId: String(reservation.event_id ?? event.id ?? event.event_id ?? ""),
    event: Object.keys(event).length ? event : null
  };
};

export const normalizeReservations = (data) =>
  unwrapList(data, ["reservations", "items", "results", "data"]).map(normalizeReservation);
