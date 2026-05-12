import { STORAGE_KEYS } from "../constants/storage";
import { apiRequest } from "./api/client";
import { normalizeHistory } from "../utils/normalizers";
import { readJson, writeJson } from "../utils/storage";

const localHistory = {
  get: () => readJson(STORAGE_KEYS.history, []),
  set: (history) => writeJson(STORAGE_KEYS.history, history)
};

export const historyService = {
  async getHistory() {
    try {
      return normalizeHistory(await apiRequest("/history/"));
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      return localHistory.get();
    }
  },

  async addHistory(item) {
    const record = {
      id: `historial-${Date.now()}`,
      itemId: item.id,
      titulo: item.titulo,
      tipo: item.tipo,
      categoria: item.categoria,
      fechaISO: new Date().toISOString()
    };

    try {
      await apiRequest(`/history/${item.id}`, { method: "POST" });
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
    }

    const next = [record, ...localHistory.get().filter((entry) => entry.itemId !== item.id)];
    localHistory.set(next);
    return record;
  },

  async removeHistory(itemId) {
    try {
      await apiRequest(`/history/${itemId}`, { method: "DELETE" });
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
    }

    localHistory.set(localHistory.get().filter((entry) => entry.itemId !== itemId));
  }
};
