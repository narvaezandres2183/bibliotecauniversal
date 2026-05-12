import { useState } from "react";
import "../../styles/components/LoginForm.css";

function LoginForm({ onSubmit, onSwitchToRegister, loading, error }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ correo, password });
  };

  return (
    <form className="caja" onSubmit={handleSubmit}>
      <h2>Inicio de sesión</h2>

      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="form-error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <p>
        ¿No tienes cuenta?
        <br />
        <button type="button" onClick={onSwitchToRegister}>
          Registrarse
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
