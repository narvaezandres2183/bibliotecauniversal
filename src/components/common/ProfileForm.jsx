import { useState } from "react";
import "../../styles/components/ProfileForm.css";

function RegistroForm({ onSubmit, onBack }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit({ correo, password });
  };

  return (
    <div className="caja">
      <h2>Registro</h2>

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

      <button onClick={handleSubmit}>Registrar</button>

      <br />
      <button onClick={onBack}>Volver</button>
    </div>
  );
}

export default RegistroForm;
