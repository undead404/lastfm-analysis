package data

import (
	"time"

	"github.com/jinzhu/gorm"
)

type LovedTrack struct {
	gorm.Model
	Date  *time.Time `gorm:"not_null"`
	Track *Track     `gorm:"foreignkey:Track.ID;not_null"`
	TrackID uint
	User *User `gorm:"foreignkey:username;not_null"`
	UserID uint
}

func (lovedTrack *LovedTrack) Create() (err error) {
	return Storage.Create(lovedTrack).Error
}
