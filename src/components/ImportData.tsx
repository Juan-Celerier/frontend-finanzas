import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { apiService } from "../services/api";
import { ImportData as ImportDataType } from "../types";

const ImportData: React.FC = () => {
  const { token } = useAuth();
  const { triggerRefresh } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jsonText, setJsonText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleData = {
    ventas: [
      {
        fecha: "2023-10-01",
        categoria: "Producto A",
        monto: 100.5,
        descripcion: "Venta importada",
      },
      {
        fecha: "2023-10-02",
        categoria: "Producto B",
        monto: 250.0,
        descripcion: "Venta mayor",
      },
    ],
    gastos: [
      {
        fecha: "2023-10-01",
        categoria: "Oficina",
        monto: 50.0,
        descripcion: "Gasto en oficina",
      },
      {
        fecha: "2023-10-02",
        categoria: "Transporte",
        monto: 30.0,
        descripcion: "Taxi",
      },
    ],
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setJsonText(content);
        setError("");
      } catch (err) {
        setError("Error al leer el archivo");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonText.trim()) {
      setError("Por favor ingresa datos JSON válidos");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data: ImportDataType = JSON.parse(jsonText);

      if (!data.ventas && !data.gastos) {
        throw new Error("El JSON debe contener 'ventas' o 'gastos'");
      }

      if (data.ventas && !Array.isArray(data.ventas)) {
        throw new Error("'ventas' debe ser un array");
      }

      if (data.gastos && !Array.isArray(data.gastos)) {
        throw new Error("'gastos' debe ser un array");
      }

      const result = await apiService.importData(token!, data);
      setSuccess(result.message || "Datos importados exitosamente");
      setJsonText("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      triggerRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al importar datos");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleData = () => {
    setJsonText(JSON.stringify(sampleData, null, 2));
    setError("");
  };

  return (
    <div className="main-content">
      <div className="card">
        <div className="card-header">
          <h3>📥 Importar Datos JSON</h3>
        </div>
        <div className="card-body">
          <div
            className="alert alert-warning"
            style={{ marginBottom: "1.5rem" }}
          >
            <strong>Formato esperado:</strong> JSON con arrays "ventas" y/o
            "gastos". Cada elemento debe tener: fecha, categoria, monto
            (número), descripcion (opcional).
          </div>

          {error && (
            <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
              {error}
            </div>
          )}

          {success && (
            <div
              className="alert alert-success"
              style={{ marginBottom: "1rem" }}
            >
              {success}
            </div>
          )}

          {/* File Upload */}
          <div className="form-group">
            <label>Cargar archivo JSON:</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="form-control"
            />
          </div>

          {/* JSON Text Area */}
          <div className="form-group">
            <label>O pega el JSON directamente:</label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='Ejemplo: {"ventas": [...], "gastos": [...]}'
              rows={15}
              style={{ fontFamily: "monospace", fontSize: "0.875rem" }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-md flex-wrap">
            <button
              onClick={loadSampleData}
              className="btn btn-outline"
              disabled={loading}
            >
              📋 Cargar Datos de Ejemplo
            </button>

            <button
              onClick={handleImport}
              className="btn btn-success"
              disabled={loading || !jsonText.trim()}
            >
              {loading ? (
                <span className="loading">Importando...</span>
              ) : (
                "🚀 Importar Datos"
              )}
            </button>
          </div>

          {/* Help */}
          <div
            className="card"
            style={{ marginTop: "2rem", backgroundColor: "#f8fafc" }}
          >
            <div className="card-body">
              <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>💡 Ayuda</h4>
              <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                <li>Las fechas deben estar en formato YYYY-MM-DD</li>
                <li>Los montos deben ser números positivos</li>
                <li>Las categorías son campos de texto libres</li>
                <li>Las descripciones son opcionales</li>
                <li>Todos los registros se asociarán a tu usuario</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportData;
