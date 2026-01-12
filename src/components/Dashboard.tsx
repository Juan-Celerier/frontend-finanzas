import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { apiService } from "../services/api";
import { LineChartPoint, Venta, Gasto } from "../types";

const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const { refreshTrigger } = useData();
  const [chartData, setChartData] = useState<LineChartPoint[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [summary, setSummary] = useState<{
    total_ventas: number;
    total_gastos: number;
    balance: number;
    count_ventas: number;
    count_gastos: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token, refreshTrigger]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load chart data and lists first
      const [chartResult, ventasResult, gastosResult] = await Promise.all([
        apiService.getDashboardData(token!),
        apiService.getVentas(token!, {
          period: "month",
          dashboard: true,
          limit: 5,
        }),
        apiService.getGastos(token!, {
          period: "month",
          dashboard: true,
          limit: 5,
        }),
      ]);

      setChartData(chartResult);
      setVentas(ventasResult);
      setGastos(gastosResult);

      // Try to load summary, but handle if endpoint doesn't exist
      try {
        const summaryResult = await apiService.getDashboardSummary(token!);
        setSummary(summaryResult);
      } catch (summaryErr) {
        // Check if it's the specific "endpoint not available" error
        if (
          summaryErr instanceof Error &&
          summaryErr.message === "SUMMARY_ENDPOINT_NOT_AVAILABLE"
        ) {
          // Summary endpoint doesn't exist - this is expected for this implementation
          console.log(
            "Dashboard summary endpoint not implemented - using calculated data from lists"
          );
          setSummary(null); // Will use fallback calculation below
        } else {
          // Re-throw other errors
          throw summaryErr;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
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

  // Use summary data for totals, fallback to calculation from displayed records
  const totalVentas =
    summary?.total_ventas ??
    ventas.reduce((sum, venta) => sum + venta.monto, 0);
  const totalGastos =
    summary?.total_gastos ??
    gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  const balance = summary?.balance ?? totalVentas - totalGastos;
  const countVentas = summary?.count_ventas ?? ventas.length;
  const countGastos = summary?.count_gastos ?? gastos.length;

  if (loading) {
    return (
      <div className="flex flex-center" style={{ minHeight: "400px" }}>
        <span className="loading">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        Error: {error}
        <button
          onClick={loadDashboardData}
          className="btn btn-primary btn-sm"
          style={{ marginLeft: "1rem" }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-3" style={{ marginBottom: "2rem" }}>
        <div className="card">
          <div className="card-body">
            <h3 style={{ color: "#10b981", margin: "0 0 0.5rem 0" }}>
              Total Ventas
            </h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
              {formatCurrency(totalVentas)}
            </p>
            <small style={{ color: "#64748b" }}>
              Este mes ({countVentas} registros)
            </small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ color: "#ef4444", margin: "0 0 0.5rem 0" }}>
              Total Gastos
            </h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
              {formatCurrency(totalGastos)}
            </p>
            <small style={{ color: "#64748b" }}>
              Este mes ({countGastos} registros)
            </small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3
              style={{
                color: balance >= 0 ? "#10b981" : "#ef4444",
                margin: "0 0 0.5rem 0",
              }}
            >
              Balance
            </h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
              {formatCurrency(balance)}
            </p>
            <small style={{ color: "#64748b" }}>Ventas - Gastos</small>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <div className="card-header">
          <h3>Tendencia Mensual</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("es-AR")
                }
              />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: number | undefined) => [
                  value !== undefined ? formatCurrency(value) : "0",
                  "",
                ]}
                labelFormatter={(label) =>
                  `Fecha: ${new Date(label).toLocaleDateString("es-AR")}`
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_ventas"
                stroke="#10b981"
                strokeWidth={2}
                name="Ventas"
              />
              <Line
                type="monotone"
                dataKey="total_gastos"
                stroke="#ef4444"
                strokeWidth={2}
                name="Gastos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <h3>Últimas Ventas</h3>
          </div>
          <div className="card-body">
            {ventas.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>
                No hay ventas registradas este mes
              </p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Categoría</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.slice(0, 5).map((venta) => (
                      <tr key={venta.id}>
                        <td>{formatDate(venta.fecha)}</td>
                        <td>{venta.categoria}</td>
                        <td style={{ fontWeight: "bold", color: "#10b981" }}>
                          {formatCurrency(venta.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Últimos Gastos</h3>
          </div>
          <div className="card-body">
            {gastos.length === 0 ? (
              <p style={{ textAlign: "center", color: "#64748b" }}>
                No hay gastos registrados este mes
              </p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Categoría</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gastos.slice(0, 5).map((gasto) => (
                      <tr key={gasto.id}>
                        <td>{formatDate(gasto.fecha)}</td>
                        <td>{gasto.categoria}</td>
                        <td style={{ fontWeight: "bold", color: "#ef4444" }}>
                          {formatCurrency(gasto.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
