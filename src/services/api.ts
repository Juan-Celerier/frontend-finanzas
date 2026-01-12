import {
  Venta,
  Gasto,
  CreateVentaRequest,
  CreateGastoRequest,
  UpdateVentaRequest,
  UpdateGastoRequest,
  LineChartPoint,
  FilterParams,
  ImportData,
} from "../types";

const FINANZAS_API_BASE =
  import.meta.env.VITE_FINANZAS_API || "http://localhost:3002";

class ApiService {
  private getAuthHeaders(token: string) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  async getVentas(token: string, filters?: FilterParams): Promise<Venta[]> {
    const params = new URLSearchParams();

    if (filters?.period) params.append("period", filters.period);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.categoria) params.append("categoria", filters.categoria);
    if (filters?.dashboard) params.append("dashboard", "true");
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const url = `${FINANZAS_API_BASE}/ventas${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error("Error al obtener ventas");
    }

    return response.json();
  }

  async createVenta(token: string, venta: CreateVentaRequest): Promise<Venta> {
    const response = await fetch(`${FINANZAS_API_BASE}/ventas`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(venta),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear venta");
    }

    return response.json();
  }

  async updateVenta(
    token: string,
    id: number,
    venta: UpdateVentaRequest
  ): Promise<Venta> {
    const response = await fetch(`${FINANZAS_API_BASE}/ventas/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(venta),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar venta");
    }

    return response.json();
  }

  async deleteVenta(token: string, id: number): Promise<void> {
    const response = await fetch(`${FINANZAS_API_BASE}/ventas/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar venta");
    }
  }

  async getGastos(token: string, filters?: FilterParams): Promise<Gasto[]> {
    const params = new URLSearchParams();

    if (filters?.period) params.append("period", filters.period);
    if (filters?.start_date) params.append("start_date", filters.start_date);
    if (filters?.end_date) params.append("end_date", filters.end_date);
    if (filters?.categoria) params.append("categoria", filters.categoria);
    if (filters?.dashboard) params.append("dashboard", "true");
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const url = `${FINANZAS_API_BASE}/gastos${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error("Error al obtener gastos");
    }

    return response.json();
  }

  async createGasto(token: string, gasto: CreateGastoRequest): Promise<Gasto> {
    const response = await fetch(`${FINANZAS_API_BASE}/gastos`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(gasto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear gasto");
    }

    return response.json();
  }

  async updateGasto(
    token: string,
    id: number,
    gasto: UpdateGastoRequest
  ): Promise<Gasto> {
    const response = await fetch(`${FINANZAS_API_BASE}/gastos/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(gasto),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar gasto");
    }

    return response.json();
  }

  async deleteGasto(token: string, id: number): Promise<void> {
    const response = await fetch(`${FINANZAS_API_BASE}/gastos/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al eliminar gasto");
    }
  }

  async getDashboardData(
    token: string,
    period: string = "month"
  ): Promise<LineChartPoint[]> {
    const response = await fetch(
      `${FINANZAS_API_BASE}/dashboard/line-chart?period=${period}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener datos del dashboard");
    }

    return response.json();
  }

  async getDashboardSummary(
    token: string,
    period: string = "month"
  ): Promise<{
    total_ventas: number;
    total_gastos: number;
    balance: number;
    count_ventas: number;
    count_gastos: number;
    period: string;
  }> {
    const response = await fetch(
      `${FINANZAS_API_BASE}/dashboard/summary?period=${period}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(token),
      }
    );

    if (!response.ok) {
      // If endpoint doesn't exist (404), throw a specific error
      if (response.status === 404) {
        throw new Error("SUMMARY_ENDPOINT_NOT_AVAILABLE");
      }
      throw new Error("Error al obtener resumen del dashboard");
    }

    return response.json();
  }

  async importData(
    token: string,
    data: ImportData
  ): Promise<{ message: string }> {
    const response = await fetch(`${FINANZAS_API_BASE}/import-json`, {
      method: "POST",
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al importar datos");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
