import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import DataManager from "./components/DataManager";
import ImportData from "./components/ImportData";

type ViewType = "dashboard" | "data" | "import";

function App() {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  if (!isAuthenticated) {
    return (
      <div className="app">
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      {/* Navigation */}
      <nav className="header" style={{ marginBottom: 0, borderBottom: "none" }}>
        <div className="header-content">
          <div className="flex gap-md">
            <button
              className={`btn ${
                currentView === "dashboard" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentView("dashboard")}
            >
              📊 Dashboard
            </button>
            <button
              className={`btn ${
                currentView === "data" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentView("data")}
            >
              📋 Gestionar Datos
            </button>
            <button
              className={`btn ${
                currentView === "import" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentView("import")}
            >
              📥 Importar Datos
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === "dashboard" ? (
        <Dashboard />
      ) : currentView === "data" ? (
        <DataManager />
      ) : (
        <ImportData />
      )}
    </div>
  );
}

export default App;
