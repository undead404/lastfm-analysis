package data

import (
	"encoding/json"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

type Job struct {
	gorm.Model
	Done      bool            `gorm:"default:false;type:boolean"`
	Params    json.RawMessage `sql:"type:json"`
	ChildJobs []*Job          `gorm:"foreignkey:ParentID;association_foreignkey:ID"`
	Name      string
	Parent    *Job `gorm:"foreignkey:ID"`
	ParentID  uint
}

func (job *Job) Create() (err error) {
	return Storage.Create(job).Error
}

func FindCollectTasteUndone() (*[]Job, error) {
	var collectTasteJobs []Job
	err := Storage.Where(&Job{
		Done: false,
		Name: "collectTaste",
	}).Find((&collectTasteJobs)).Error
	return &collectTasteJobs, err
}
