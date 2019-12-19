package data

import "github.com/jinzhu/gorm"

type Track struct {
	gorm.Model
	ArtistName string `gorm:"not_null"`
	Name       string `gorm:"not_null"`
}

func FindOrCreateTrack(artistName string, name string) (*Track, error) {
	track := Track{
		ArtistName: artistName,
		Name:       name,
	}
	query := Storage.Where(track)
	operation := query.First(&track)
	err := operation.Error
	if gorm.IsRecordNotFoundError(err) {
		err = track.Create()
	}
	return &track, err

}

func (track *Track) Create() (err error) {
	return Storage.Create(track).Error
}
