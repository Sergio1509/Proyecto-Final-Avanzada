package models

import (
	"backend-avanzada/api"
	"time"
)

type Mission struct {
	ID          uint
	Title       string
	Description string
	Status      string
	PersonID    uint
	Person      *Person
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// DTO para respuesta API
func (m *Mission) ToMissionResponseDto() *api.MissionResponseDto {
	return &api.MissionResponseDto{
		ID:          int(m.ID),
		Title:       m.Title,
		Description: m.Description,
		Status:      m.Status,
		CreatedAt:   m.CreatedAt.String(),
		Person:      m.Person.ToPersonResponseDto(),
	}
}
