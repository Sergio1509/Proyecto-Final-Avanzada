import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { Person } from "../../models/person";
import { useNavigate } from "react-router";

function People() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [newAlquimista, setNewAlquimista] = useState({
    name: "",
    rank: "",
    specialty: ""
  });
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    rank: "",
    specialty: ""
  });

  useEffect(() => {
    const fetchPeople = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("¡Error!", "No hay token, inicia sesión primero", "warning");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/people`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setPeople(data);
      } catch (error) {
        Swal.fire("¡Error!", "Error en la petición: " + error, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPeople();
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el registro.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/people${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPeople((prev) => prev.filter((p) => p.person_id !== id));
        Swal.fire("Eliminado", "El registro fue eliminado", "success");
      } else {
        const errorText = await res.text();
        throw new Error(errorText);
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo eliminar: " + err, "error");
    }
  };

  const handleEdit = (person: Person) => {
    setEditPerson(person);
    setEditForm({
      name: person.name,
      rank: person.rank,
      specialty: person.specialty
    });
  };

  const handleUpdatePerson = async () => {
    if (!editPerson) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/people/${editPerson.person_id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editForm.name,
          rank: editForm.rank,
          specialty: editForm.specialty
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const updated = await res.json();
      setPeople((prev) =>
        prev.map((p) => (p.person_id === updated.person_id ? updated : p))
      );
      Swal.fire("Actualizado", "El alquimista fue editado correctamente", "success");
      setEditPerson(null);
    } catch (err) {
      Swal.fire("Error", "No se pudo actualizar: " + err, "error");
    }
  };

  const handleCreateAlquimista = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/people`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newAlquimista.name,
          rank: newAlquimista.rank,
          specialty: newAlquimista.specialty
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const created = await res.json();
      setPeople((prev) => [...prev, created]);
      Swal.fire("¡Listo!", "Alquimista creado correctamente", "success");
      setShowForm(false);
      setNewAlquimista({ name: "", rank: "", specialty: "" });
    } catch (err) {
      Swal.fire("Error", "No se pudo crear: " + err, "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-yellow-300 rounded-4xl shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Lista de Personas</h2>
        <button
          className="bg-green-600 text-black px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Añadir Alquimista
        </button>
       <button
        className="bg-red-500 text-black px-2 py-1 rounded"
        onClick={() => navigate("/Misiones")}
        >
        Misiones
      </button>
      </div>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : people.length === 0 ? (
        <p className="text-center">No hay personas registradas.</p>
      ) : (
        <table className="w-full border-collapse border border-slate-400">
          <thead>
            <tr className="bg-slate-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Rango</th>
              <th className="border p-2">Especialidad</th>
              <th className="border p-2">Creado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr key={person.person_id}>
                <td className="border p-2">{person.person_id}</td>
                <td className="border p-2">{person.name}</td>
                <td className="border p-2">{person.rank}</td>
                <td className="border p-2">{person.specialty}</td>
                <td className="border p-2">
                  {new Date(person.created_at).toLocaleString()}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    className="bg-blue-500 text-black px-2 py-1 rounded"
                    onClick={() => handleEdit(person)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-black px-2 py-1 rounded"
                    onClick={() => handleDelete(person.person_id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para crear alquimista */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">Nuevo Alquimista</h3>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full mb-2 p-2 border rounded"
              value={newAlquimista.name}
              onChange={(e) =>
                setNewAlquimista({ ...newAlquimista, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Rango"
              className="w-full mb-2 p-2 border rounded"
              value={newAlquimista.rank}
              onChange={(e) =>
                setNewAlquimista({ ...newAlquimista, rank: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Especialidad"
              className="w-full mb-2 p-2 border rounded"
              value={newAlquimista.specialty}
              onChange={(e) =>
                setNewAlquimista({ ...newAlquimista, specialty: e.target.value })
              }
            />
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="bg-gray-400 text-black px-4 py-2 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 text-black px-4 py-2 rounded"
                onClick={handleCreateAlquimista}
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

export { People };
