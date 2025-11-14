package repository

import (
	"backend-avanzada/models"
	"errors"

	"gorm.io/gorm"
)

type MissionRepository struct {
	db *gorm.DB
}

func NewMissionRepository(db *gorm.DB) *MissionRepository {
	return &MissionRepository{
		db: db,
	}
}

func (k *MissionRepository) FindAll() ([]*models.Mission, error) {
	var kills []*models.Mission
	err := k.db.Preload("Person").Find(&kills).Error
	if err != nil {
		return nil, err
	}
	return kills, nil
}

func (k *MissionRepository) Save(data *models.Mission) (*models.Mission, error) {
	err := k.db.Save(data).Error
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (k *MissionRepository) FindById(id int) (*models.Mission, error) {
	var kill models.Mission
	err := k.db.Where("person_id = ?", id).First(&kill).Error
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	return &kill, nil
}

func (k *MissionRepository) Delete(data *models.Mission) error {
	return errors.New("this method is not implemented")
}
