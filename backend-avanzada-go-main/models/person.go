package models

import (
	"backend-avanzada/api"

	"gorm.io/gorm"
)

type Person struct {
	gorm.Model
	Name      string
	Rank      string
	Specialty string
}

func (p *Person) ToPersonResponseDto() *api.PersonResponseDto {
	return &api.PersonResponseDto{
		ID:            int(p.ID),
		Nombre:        p.Name,
		Rango:         p.Rank,
		Especialidad:  p.Specialty,
		FechaCreacion: p.CreatedAt.String(),
	}
}
