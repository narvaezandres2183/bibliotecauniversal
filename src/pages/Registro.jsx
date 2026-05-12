import { useState } from "react";
import AuthLayout from "../components/layout/AuthLayout";
import RegistroForm from "../components/common/RegistroForm";
import { useAuth } from "../hooks/useAuth";

function Registro({ cambiarPagina }) {
  const { register } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async ({ nombre, correo, password }) => {
    setError("");

    if (!correo || !password) {
      setError("Ingresa correo y contraseña.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register({ nombre, correo, password });
      cambiarPagina("login");
    } catch (err) {
      setError(err.message || "No se pudo registrar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="caja">
        <h2>Registro</h2>
        <RegistroForm
          onSubmit={handleRegister}
          onBack={() => cambiarPagina("login")}
          loading={loading}
          error={error}
        />
      </div>
    </AuthLayout>
  );
}

export default Registro;
