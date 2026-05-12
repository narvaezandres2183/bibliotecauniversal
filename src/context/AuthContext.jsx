import { useCallback, useEffect, useState } from "react";
import { authService } from "../services/auth.service";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => authService.getStoredUser());
  const [validarSesion, setValidarSesion] = useState(() => Boolean(authService.getStoredUser()));
  const [authLoading, setAuthLoading] = useState(() => Boolean(authService.getStoredUser()));

  useEffect(() => {
    let activo = true;

    if (!validarSesion) {
      return undefined;
    }

    authService
      .getCurrentUser()
      .then((user) => {
        if (activo) {
          setUsuario(user);
        }
      })
      .catch(() => {
        if (activo) {
          setUsuario(authService.getStoredUser());
        }
      })
      .finally(() => {
        if (activo) {
          setAuthLoading(false);
          setValidarSesion(false);
        }
      });

    return () => {
      activo = false;
    };
  }, [validarSesion]);

  const login = useCallback(async (credentials) => {
    const user = await authService.login(credentials);
    setUsuario(user);
    return user;
  }, []);

  const register = useCallback(async (userData) => authService.register(userData), []);

  const logout = useCallback(() => {
    authService.logout();
    setUsuario(null);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, authLoading, login, register, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}
