import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import LoginForm from "../components/common/LoginForm";
import { useAuth } from "../hooks/useAuth";

function Login({ cambiarPagina, iniciarSesion }) {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ correo, password }) => {
    setError("");

    if (!correo || !password) {
      setError("Ingresa correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await login({ correo, password });
      iniciarSesion();
    } catch (err) {
      setError(err.message || "Datos incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <LoginForm
        onSubmit={handleLogin}
        onSwitchToRegister={() => cambiarPagina("registro")}
        loading={loading}
        error={error}
      />
    </AuthLayout>
  );
}

export default Login;
