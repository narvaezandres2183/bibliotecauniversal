import { STORAGE_KEYS } from "../constants/storage";
import { apiRequest } from "./api/client";
import {
  normalizeEvents,
  normalizeReservations
} from "../utils/normalizers";
import { readJson, writeJson } from "../utils/storage";

const fallbackEvents = [
  {
    id: "evento-1",
    titulo: "Club de lectura: Realismo mágico",
    descripcion: "Conversatorio sobre autores latinoamericanos y lectura guiada.",
    fecha: "2026-03-20",
    hora: "18:00",
    lugar: "Sala Cultural A",
    moderador: "Laura Restrepo",
    cupoTotal: 25,
    inscritos: 17,
    inscrito: false
  },
  {
    id: "evento-2",
    titulo: "Taller de cómic documental",
    descripcion: "Análisis de narrativa visual y creación de viñetas en grupo.",
    fecha: "2026-03-24",
    hora: "16:30",
    lugar: "Aula Creativa 2",
    moderador: "Daniel Cárdenas",
    cupoTotal: 20,
    inscritos: 18,
    inscrito: false
  },
  {
    id: "evento-3",
    titulo: "Mesa abierta: filosofía y actualidad",
    descripcion: "Debate sobre pensamiento clásico aplicado a problemas modernos.",
    fecha: "2026-03-28",
    hora: "17:00",
    lugar: "Auditorio Central",
    moderador: "Paula Sánchez",
    cupoTotal: 30,
    inscritos: 8,
    inscrito: false
  }
];

const localReservationIds = {
  get: () => new Set(readJson(STORAGE_KEYS.eventReservations, [])),
  set: (ids) => writeJson(STORAGE_KEYS.eventReservations, [...ids])
};

const mergeReservations = (events, reservations) => {
  const reservationIds = new Set(reservations.map((reservation) => reservation.eventId));
  const reservationByEvent = new Map(
    reservations.map((reservation) => [reservation.eventId, reservation.id])
  );

  return events.map((event) => ({
    ...event,
    inscrito: event.inscrito || reservationIds.has(event.id),
    reservationId: event.reservationId ?? reservationByEvent.get(event.id) ?? null
  }));
};

export const eventsService = {
  async getEvents() {
    try {
      const reservations = normalizeReservations(
        await apiRequest("/event-reservations/me")
      );
      const reservationIds = new Set(reservations.map((reservation) => reservation.eventId));
      const events = normalizeEvents(await apiRequest("/events/"), reservationIds);
      return mergeReservations(events, reservations);
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      const reservedIds = localReservationIds.get();
      return fallbackEvents.map((event) => ({
        ...event,
        inscrito: reservedIds.has(event.id),
        inscritos: event.inscritos + (reservedIds.has(event.id) ? 1 : 0)
      }));
    }
  },

  async reserve(event) {
    try {
      await apiRequest(`/event-reservations/${event.id}`, { method: "POST" });
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      const ids = localReservationIds.get();
      ids.add(event.id);
      localReservationIds.set(ids);
    }
  },

  async cancel(event) {
    try {
      await apiRequest(`/event-reservations/${event.id}`, { method: "DELETE" });
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      const ids = localReservationIds.get();
      ids.delete(event.id);
      localReservationIds.set(ids);
    }
  },

  async getEvent(eventId) {
    const data = await apiRequest(`/events/${eventId}`);
    return normalizeEvents([data])[0];
  },

  async createEvent(event) {
    const data = await apiRequest("/events/", {
      method: "POST",
      body: {
        name: event.titulo ?? event.name,
        description: event.descripcion ?? event.description ?? "",
        event_date: event.fecha ?? event.event_date,
        event_time: event.hora ?? event.event_time,
        place: event.lugar ?? event.place,
        moderator: event.moderador ?? event.moderator,
        capacity: Number(event.cupoTotal ?? event.capacity ?? 30)
      }
    });
    return normalizeEvents([data])[0];
  },

  async updateEvent(eventId, event) {
    const data = await apiRequest(`/events/${eventId}`, {
      method: "PUT",
      body: {
        name: event.titulo ?? event.name,
        description: event.descripcion ?? event.description ?? "",
        event_date: event.fecha ?? event.event_date,
        event_time: event.hora ?? event.event_time,
        place: event.lugar ?? event.place,
        moderator: event.moderador ?? event.moderator,
        capacity: Number(event.cupoTotal ?? event.capacity ?? 30)
      }
    });
    return normalizeEvents([data])[0];
  },

  async deleteEvent(eventId) {
    await apiRequest(`/events/${eventId}`, { method: "DELETE" });
  }
};
