import { STORAGE_KEYS } from "../constants/storage";
import { apiRequest } from "./api/client";
import { normalizeFavorites } from "../utils/normalizers";
import { readJson, writeJson } from "../utils/storage";

const localFavorites = {
  get: () => readJson(STORAGE_KEYS.favorites, []),
  set: (favorites) => writeJson(STORAGE_KEYS.favorites, favorites)
};

export const favoritesService = {
  async getFavorites() {
    try {
      return normalizeFavorites(await apiRequest("/favorites/"));
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      return localFavorites.get();
    }
  },

  async addFavorite(item) {
    try {
      await apiRequest(`/favorites/${item.id}`, { method: "POST" });
      return item;
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      const next = [...localFavorites.get().filter((favorite) => favorite.id !== item.id), item];
      localFavorites.set(next);
      return item;
    }
  },

  async removeFavorite(item) {
    try {
      await apiRequest(`/favorites/${item.id}`, { method: "DELETE" });
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      localFavorites.set(localFavorites.get().filter((favorite) => favorite.id !== item.id));
    }
  }
};
