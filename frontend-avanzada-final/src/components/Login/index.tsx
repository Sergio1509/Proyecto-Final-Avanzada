import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router"; 

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: user, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);

        Swal.fire({
          title: "¡Éxito!",
          text: "Login exitoso",
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => {
          navigate("/Alquimistas");
        });
      } else {
        const errorText = await response.text();
        Swal.fire({
          title: "¡Error!",
          text: "Error: " + errorText,
          icon: "error",
          confirmButtonText: "De acuerdo",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "¡Error!",
        text: "Error en la petición: " + error,
        icon: "error",
        confirmButtonText: "De acuerdo",
      });
      console.error("Error en la petición:", error);
    }
  };

  return (
    <div className="max-w-max mx-auto mt-10 p-6 bg-yellow-300 rounded-4xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-slate-800">
        Iniciar Sesión
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3>Usuario:</h3>
          <input
            className="bg-white rounded-4xl p-2"
            type="text"
            name="user"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <h3>Contraseña:</h3>
          <input
            className="bg-white rounded-4xl p-2"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-green-600 text-black p-3 rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}

export { Login };