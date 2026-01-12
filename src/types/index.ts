export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
}

export interface Venta {
  id: number;
  fecha: string;
  categoria: string;
  monto: number;
  descripcion: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface Gasto {
  id: number;
  fecha: string;
  categoria: string;
  monto: number;
  descripcion: string;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVentaRequest {
  fecha: string;
  categoria: string;
  monto: number;
  descripcion: string;
}

export interface CreateGastoRequest {
  fecha: string;
  categoria: string;
  monto: number;
  descripcion: string;
}

export interface UpdateVentaRequest extends Partial<CreateVentaRequest> {}
export interface UpdateGastoRequest extends Partial<CreateGastoRequest> {}

export interface DashboardData {
  ventas: Venta[];
  gastos: Gasto[];
  lineChartData: LineChartPoint[];
}

export interface LineChartPoint {
  period: string;
  total_ventas: number;
  total_gastos: number;
  balance: number;
}

export type PeriodType = "day" | "week" | "month" | "year";

export interface FilterParams {
  period?: PeriodType;
  start_date?: string;
  end_date?: string;
  categoria?: string;
  dashboard?: boolean;
  limit?: number;
}

export interface ImportData {
  ventas: CreateVentaRequest[];
  gastos: CreateGastoRequest[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
