import React from "react";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="logo">
          Dashboard Finanzas
        </a>

        {isAuthenticated && (
          <div className="user-info">
            <span className="user-name">Hola, {user?.nombre}</span>
            <button onClick={logout} className="btn btn-outline btn-sm">
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
