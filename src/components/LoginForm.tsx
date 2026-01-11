import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { RegisterRequest } from "../types";

const LoginForm: React.FC = () => {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "user" as const,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        const registerData: RegisterRequest = {
          nombre: formData.nombre,
          email: formData.email,
          password: formData.password,
          rol: formData.rol,
        };
        await register(registerData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-center" style={{ minHeight: "100vh" }}>
      <div className="card" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-header">
          <h3>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Tu contraseña"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="rol">Rol</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? (
                <span className="loading">
                  {isLogin ? "Iniciando sesión..." : "Creando cuenta..."}
                </span>
              ) : isLogin ? (
                "Iniciar Sesión"
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setFormData({
                  nombre: "",
                  email: "",
                  password: "",
                  rol: "user",
                });
              }}
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
