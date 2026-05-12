import { STORAGE_KEYS } from "../../constants/storage";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ""
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const isApiConfigured = () => Boolean(API_BASE_URL);

export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.authToken);

export const setAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.authToken, token);
  }
  if (user) {
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(STORAGE_KEYS.authToken);
  localStorage.removeItem(STORAGE_KEYS.authUser);
};

const readResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const apiRequest = async (path, options = {}) => {
  if (!API_BASE_URL) {
    throw new ApiError("API base URL no configurada", 0);
  }

  const {
    method = "GET",
    body,
    headers = {},
    skipAuth = false
  } = options;

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await readResponse(response);

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      "No se pudo completar la solicitud";
    throw new ApiError(message, response.status, data);
  }

  return data;
};
