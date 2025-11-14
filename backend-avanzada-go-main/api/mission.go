package api

type MissionRequestDto struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"`
	PersonID    uint   `json:"person_id"`
}

type MissionResponseDto struct {
	ID          int                `json:"id"`
	Title       string             `json:"title"`
	Description string             `json:"description"`
	Status      string             `json:"status"`
	CreatedAt   string             `json:"created_at"`
	Person      *PersonResponseDto `json:"person"`
}

type MissionTaskResponseDto struct {
	Person *PersonResponseDto `json:"person"`
	Status string             `json:"status"`
}
