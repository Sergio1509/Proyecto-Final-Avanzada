package server

import (
	"backend-avanzada/auth"
	"net/http"

	"github.com/gorilla/mux"
)

func (s *Server) router() http.Handler {
	router := mux.NewRouter()
	router.Use(s.logger.RequestLogger)

	// Ruta pública
	router.HandleFunc("/login", auth.LoginHandler).Methods(http.MethodPost)

	// Subrouter protegido
	protected := router.PathPrefix("/").Subrouter()
	protected.Use(auth.JWTMiddleware)

	// CRUD de Alquimistas (People)
	protected.HandleFunc("/people", s.HandlePeople).Methods(http.MethodGet, http.MethodPost)
	protected.HandleFunc("/people/{id}", s.HandlePeopleWithId).Methods(http.MethodGet, http.MethodPut, http.MethodDelete)

	// CRUD de Misiones
	protected.HandleFunc("/missions", s.HandleMissions).Methods(http.MethodGet)
	protected.HandleFunc("/missions/{id}", s.HandleMissionWithId).Methods(http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete)

	// Ejemplo de ruta protegida adicional
	protected.HandleFunc("/alquimistas", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Ruta protegida: listado de alquimistas"))
	}).Methods(http.MethodGet)

	return router
}
