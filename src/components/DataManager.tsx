import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { apiService } from "../services/api";
import { Venta, Gasto, FilterParams } from "../types";
import VentasForm from "./VentasForm";
import GastosForm from "./GastosForm";

const DataManager: React.FC = () => {
  const { token } = useAuth();
  const { triggerRefresh } = useData();
  const [activeTab, setActiveTab] = useState<"ventas" | "gastos">("ventas");
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Venta | Gasto | null>(null);

  const [filters, setFilters] = useState<FilterParams>({
    period: "month",
  });

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, activeTab, filters]);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      if (activeTab === "ventas") {
        const data = await apiService.getVentas(token!, filters);
        setVentas(data);
      } else {
        const data = await apiService.getGastos(token!, filters);
        setGastos(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: Venta | Gasto) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este registro?")) {
      return;
    }

    try {
      if (activeTab === "ventas") {
        await apiService.deleteVenta(token!, id);
        setVentas(ventas.filter((v) => v.id !== id));
      } else {
        await apiService.deleteGasto(token!, id);
        setGastos(gastos.filter((g) => g.id !== id));
      }
      triggerRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingItem(null);
    loadData();
    triggerRefresh();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR");
  };

  if (showForm) {
    return (
      <div className="main-content">
        {activeTab === "ventas" ? (
          <VentasForm
            venta={editingItem as Venta}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        ) : (
          <GastosForm
            gasto={editingItem as Gasto}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Tabs */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-body">
          <div className="flex" style={{ borderBottom: "1px solid #e5e7eb" }}>
            <button
              className={`btn ${
                activeTab === "ventas" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setActiveTab("ventas")}
              style={{ borderRadius: "0.5rem 0 0 0" }}
            >
              Ventas
            </button>
            <button
              className={`btn ${
                activeTab === "gastos" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setActiveTab("gastos")}
              style={{ borderRadius: "0 0.5rem 0 0" }}
            >
              Gastos
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-header">
          <h3>Gestión de {activeTab === "ventas" ? "Ventas" : "Gastos"}</h3>
        </div>
        <div className="card-body">
          <div className="flex flex-between flex-wrap gap-md">
            <div className="flex gap-md">
              <div className="form-group" style={{ margin: 0 }}>
                <label htmlFor="period" style={{ fontSize: "0.875rem" }}>
                  Período:
                </label>
                <select
                  id="period"
                  name="period"
                  value={filters.period || ""}
                  onChange={handleFilterChange}
                  style={{ width: "auto", marginLeft: "0.5rem" }}
                >
                  <option value="day">Día</option>
                  <option value="week">Semana</option>
                  <option value="month">Mes</option>
                  <option value="year">Año</option>
                </select>
              </div>
            </div>

            <button onClick={handleCreate} className="btn btn-success">
              + Nuevo {activeTab === "ventas" ? "Venta" : "Gasto"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="card">
        <div className="card-body">
          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-center" style={{ minHeight: "200px" }}>
              <span className="loading">Cargando datos...</span>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {activeTab === "ventas" ? (
                    ventas.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "center", padding: "2rem" }}
                        >
                          No hay ventas registradas
                        </td>
                      </tr>
                    ) : (
                      ventas.map((venta) => (
                        <tr key={venta.id}>
                          <td>{formatDate(venta.fecha)}</td>
                          <td>{venta.categoria}</td>
                          <td>{venta.descripcion || "-"}</td>
                          <td style={{ fontWeight: "bold", color: "#10b981" }}>
                            {formatCurrency(venta.monto)}
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                onClick={() => handleEdit(venta)}
                                className="btn btn-outline btn-sm"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(venta.id)}
                                className="btn btn-danger btn-sm"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  ) : gastos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", padding: "2rem" }}
                      >
                        No hay gastos registrados
                      </td>
                    </tr>
                  ) : (
                    gastos.map((gasto) => (
                      <tr key={gasto.id}>
                        <td>{formatDate(gasto.fecha)}</td>
                        <td>{gasto.categoria}</td>
                        <td>{gasto.descripcion || "-"}</td>
                        <td style={{ fontWeight: "bold", color: "#ef4444" }}>
                          {formatCurrency(gasto.monto)}
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              onClick={() => handleEdit(gasto)}
                              className="btn btn-outline btn-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(gasto.id)}
                              className="btn btn-danger btn-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataManager;
