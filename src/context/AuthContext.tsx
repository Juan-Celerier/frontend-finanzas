import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType, User, LoginRequest, RegisterRequest } from "../types";

const AUTH_API_BASE = `${
  import.meta.env.VITE_AUTH_API || "http://localhost:3001"
}/auth`;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch(`${AUTH_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password } as LoginRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el login");
      }

      const data = await response.json();
      const { token } = data;

      const userResponse = await fetch(`${AUTH_API_BASE}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Error al obtener información del usuario");
      }

      const userData = await userResponse.json();

      setToken(token);
      setUser(userData);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    try {
      const response = await fetch(`${AUTH_API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error en el registro");
      }

      await login(userData.email, userData.password);
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  const logout = (): void => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
