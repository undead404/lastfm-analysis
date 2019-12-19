package data

import "github.com/jinzhu/gorm"

type TrackTag struct {
	gorm.Model
	Tag     Tag `gorm:"foreignkey:Tag.Slug;not_null"`
	TagSlug string
	Track   Track `gorm:"ForeignKey:Track.ID;not_null;OnDelete:Cascade"`
	TrackID uint
	Weight  uint `gorm:"not_null"`
}

func (trackTag *TrackTag) Save() (err error) {
	return Storage.Create(trackTag).Error
}
