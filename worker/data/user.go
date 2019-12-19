package data

import (
	"strconv"
	"time"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	LovedTracks []*LovedTrack `gorm:"foreignkey:id;association_foreignkey:id`
	Username    string        `gorm:"primary_key;not_null"`
}

func (user *User) FindOrCreateLovedTrack(artistName, name, uts string) (*LovedTrack, error) {
	lovedAtUnix, err := strconv.Atoi(uts)
	if err != nil {
		return nil, err
	}
	lovedAt := time.Unix(int64(lovedAtUnix), 0)
	if user.LovedTracks != nil {
		for i := 0; i < len(user.LovedTracks); i++ {
			lovedTrack := user.LovedTracks[i]
			if lovedTrack.Track.ArtistName == artistName && lovedTrack.Track.Name == name {
				return lovedTrack, nil
			}
		}
	}
	track, err := FindOrCreateTrack(artistName, name)
	if err != nil {
		return nil, err
	}
	lovedTrack := LovedTrack{
		Date:  &lovedAt,
		TrackID: track.ID,
		UserID: user.ID,
	}
	err = lovedTrack.Create()
	if err != nil {
		return nil, err
	}
	return &lovedTrack, nil
}

func FindOrCreateUser(username string) (*User, error) {
	user := User{
		Username: username,
	}
	query := Storage.Where(user)
	operation := query.First(&user)
	err := operation.Error
	// err := Storage.Find(User{
	// 	Username: username,
	// }).First(&user).Error
	if gorm.IsRecordNotFoundError(err) {
		err = user.Create()
	}
	return &user, err
}

func (user *User) Create() (err error) {
	return Storage.Create(user).Error
}
