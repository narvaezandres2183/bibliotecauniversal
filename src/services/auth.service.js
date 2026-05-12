import {
  apiRequest,
  clearAuthSession,
  setAuthSession
} from "./api/client";
import { STORAGE_KEYS } from "../constants/storage";
import { normalizeUser } from "../utils/normalizers";
import { readJson, writeJson } from "../utils/storage";

const buildCredentialsPayload = ({ correo, password, nombre }) => ({
  correo,
  email: correo,
  password,
  ...(nombre ? { nombre, name: nombre } : {})
});

const extractSession = (data, fallbackCorreo) => {
  const token = data?.access_token ?? data?.token ?? data?.jwt ?? null;
  const user = normalizeUser(data?.user ?? data?.usuario ?? { correo: fallbackCorreo });
  return { token, user };
};

export const authService = {
  getStoredUser() {
    return readJson(STORAGE_KEYS.authUser, null);
  },

  async login(credentials) {
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: buildCredentialsPayload(credentials),
        skipAuth: true
      });
      const session = extractSession(data, credentials.correo);
      setAuthSession(session);
      if (session.token) {
        return authService.getCurrentUser();
      }
      return session.user;
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }

      const legacyUser = readJson(STORAGE_KEYS.legacyUser, null);
      if (
        legacyUser?.correo === credentials.correo &&
        legacyUser?.password === credentials.password
      ) {
        const user = normalizeUser(legacyUser);
        setAuthSession({ user });
        return user;
      }
      throw new Error("No se pudo iniciar sesión. Verifica tus credenciales.");
    }
  },

  async register(userData) {
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: buildCredentialsPayload(userData),
        skipAuth: true
      });
      return normalizeUser(data?.user ?? data?.usuario ?? data);
    } catch (error) {
      if (error.status !== 0) {
        throw error;
      }

      writeJson(STORAGE_KEYS.legacyUser, userData);
      return normalizeUser(userData);
    }
  },

  async getCurrentUser() {
    const data = await apiRequest("/users/me");
    const user = normalizeUser(data?.user ?? data?.usuario ?? data);
    setAuthSession({ user });
    return user;
  },

  logout() {
    clearAuthSession();
  }
};
