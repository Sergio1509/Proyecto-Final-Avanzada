package api

type PersonRequestDto struct {
	Nombre       string `json:"name"`
	Rango        string `json:"rank"`
	Especialidad string `json:"specialty"`
}

type PersonResponseDto struct {
	ID            int    `json:"person_id"`
	Nombre        string `json:"name"`
	Rango         string `json:"rank"`
	Especialidad  string `json:"specialty"`
	FechaCreacion string `json:"created_at"`
}

type ErrorResponse struct {
	Status      int    `json:"status"`
	Description string `json:"description"`
	Message     string `json:"message"`
}
