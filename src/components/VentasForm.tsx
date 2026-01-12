import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiService } from "../services/api";
import { Venta } from "../types";

interface VentasFormProps {
  venta?: Venta;
  onSuccess: () => void;
  onCancel: () => void;
}

const VentasForm = ({ venta, onSuccess, onCancel }: VentasFormProps) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fecha: venta?.fecha || new Date().toISOString().split("T")[0],
    categoria: venta?.categoria || "",
    monto: venta?.monto?.toString() || "",
    descripcion: venta?.descripcion || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const data = {
        fecha: formData.fecha,
        categoria: formData.categoria,
        monto: parseFloat(formData.monto),
        descripcion: formData.descripcion,
      };

      if (venta) {
        await apiService.updateVenta(token!, venta.id, data);
      } else {
        await apiService.createVenta(token!, data);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar venta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>{venta ? "Editar Venta" : "Nueva Venta"}</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fecha">Fecha</label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoria">Categoría</label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              placeholder="Ej: Producto A, Servicio B..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto ($)</label>
            <input
              type="number"
              id="monto"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción opcional..."
              rows={3}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="flex gap-md">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading">
                  {venta ? "Actualizando..." : "Creando..."}
                </span>
              ) : venta ? (
                "Actualizar Venta"
              ) : (
                "Crear Venta"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentasForm;
