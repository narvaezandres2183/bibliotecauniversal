import { apiRequest, setAuthSession } from "./api/client";
import { STORAGE_KEYS } from "../constants/storage";
import { normalizeUser } from "../utils/normalizers";
import { writeJson } from "../utils/storage";

export const usersService = {
  async getProfile() {
    const data = await apiRequest("/users/me");
    return normalizeUser(data?.user ?? data?.usuario ?? data);
  },

  async updateProfile(profile) {
    try {
      const data = await apiRequest("/users/me", {
        method: "PUT",
        body: {
          nombre: profile.nombre,
          name: profile.nombre,
          correo: profile.correo,
          email: profile.correo,
          biografia: profile.biografia,
          bio: profile.biografia,
          email_notifications: profile.notificacionesEmail,
          nivel: profile.nivel
        }
      });
      const user = normalizeUser(data?.user ?? data?.usuario ?? data);
      setAuthSession({ user });
      return user;
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }
      const user = normalizeUser(profile);
      writeJson(STORAGE_KEYS.authUser, user);
      return user;
    }
  }
};
