import { BrowserRouter, Route, Routes } from "react-router";
import { People } from "./components/Alquimistas";
import { Misiones } from "./components/Misiones";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
          <Route path="/alquimistas" element={<ProtectedRoute><People /></ProtectedRoute>} />
          <Route path="/misiones" element={<ProtectedRoute><Misiones /></ProtectedRoute>} />
          <Route path="*" element={<People />} />
      </Routes>
  );
}

export default App;
