import { useEffect, useState } from "react";
import "../../styles/sections/ProfileSection.css";

function ProfileSection({ perfil, onProfileChange }) {
  const [form, setForm] = useState(perfil);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setForm(perfil);
  }, [perfil]);

  const updateField = (field, value) => {
    setForm((actual) => ({ ...actual, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setGuardando(true);
    await onProfileChange(form);
    setGuardando(false);
  };

  return (
    <section className="seccion">
      <h2>Perfil de usuario</h2>
      <div className="perfil-header">
        <span className="nivel">Nivel: {form.nivel}</span>
      </div>
      <form
        className="detalle perfil-form"
        onSubmit={handleSubmit}
      >
        <label>
          Nombre completo
          <input
            type="text"
            value={form.nombre}
            onChange={(e) => updateField("nombre", e.target.value)}
          />
        </label>
        <label>
          Correo
          <input
            type="email"
            value={form.correo}
            onChange={(e) => updateField("correo", e.target.value)}
          />
        </label>
        <label>
          Información personal
          <textarea
            value={form.biografia}
            onChange={(e) => updateField("biografia", e.target.value)}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={form.notificacionesEmail}
            onChange={(e) =>
              updateField("notificacionesEmail", e.target.checked)
            }
          />
          Recibir notificaciones por email
        </label>
        <button type="submit" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}

export default ProfileSection;
