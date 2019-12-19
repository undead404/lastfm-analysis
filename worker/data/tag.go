package data

import "github.com/jinzhu/gorm"

type Tag struct {
	gorm.Model
	Hashtag string
	Name    string
	Slug    string `gorm:"primary_key;not_null"`
}

func (tag *Tag) Save() (err error) {
	return Storage.Create(tag).Error
}
