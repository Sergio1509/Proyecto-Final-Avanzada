import React, { useEffect, useState } from "react";
import type { Mission } from "../../models/mission";
import type { Person } from "../../models/person";

function Misiones() {
  const [mission, setMission] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newMissionId, setNewMissionId] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");
  const [alquimistas, setAlquimistas] = useState<Person[]>([]);

  const fetchMission = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No hay token disponible");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/missions", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      setMission(data);
    } catch (err) {
      console.error("Error al obtener misiones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchMission();
  fetchAlquimistas();
}, []);

const handleCreateMission = async () => {
  setError("");
  const token = localStorage.getItem("token");
  if (!token) {
    setError("No hay token disponible");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8000/missions/${newMissionId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: newDescription }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText);
    }

    setShowModal(false);
    setNewMissionId("");
    setNewDescription("");

    // Espera 3 segundos antes de recargar
    setTimeout(() => {
      fetchMission();
    }, 3000);
  } catch (err: any) {
    setError("Error al crear misión: " + err.message);
  }
};

const fetchAlquimistas = async () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch("http://localhost:8000/people", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    setAlquimistas(data);
  } catch (err) {
    console.error("Error al obtener alquimistas:", err);
  }
};



  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-yellow-300 rounded-4xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Misiones y experimentos</h2>
        <button
          className="bg-green-600 text-black px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowModal(true)}
        >
          Añadir misión
        </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando misiones...</p>
      ) : mission.length === 0 ? (
        <p className="text-center">No hay misiones disponibles.</p>
      ) : (
        <table className="w-full border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-200">
              <th className="border p-2">ID Persona</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Rango</th>
              <th className="border p-2">Especialidad</th>
              <th className="border p-2">Creado</th>
              <th className="border p-2">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {mission.map((missi) => (
              <tr key={missi.id}>
                <td className="border p-2">{missi.person.person_id}</td>
                <td className="border p-2">{missi.person.name}</td>
                <td className="border p-2">{missi.person.rank}</td>
                <td className="border p-2">{missi.person.specialty}</td>
                <td className="border p-2">
                  {new Date(missi.person.created_at).toLocaleString()}
                </td>
                <td className="border p-2">{missi.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nueva misión</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <label className="block mb-2">
                 Alquimista:
             <select
             value={newMissionId}
             onChange={(e) => setNewMissionId(e.target.value)}
             className="w-full border p-2 rounded mt-1"
             >
              <option value="">Selecciona un alquimista</option>
              {alquimistas.map((a) => (
               <option key={a.person_id} value={a.person_id}>
              {a.name} ({a.rank} - {a.specialty})
          </option>
         ))}
  </select>
</label>

            <label className="block mb-4">
              Descripción:
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full border p-2 rounded mt-1"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-400 text-black px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCreateMission}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Misiones };
