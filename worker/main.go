package main

import (
	"fmt"
	//"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"

	"log"

	"github.com/subosito/gotenv"
	"github.com/undead404/lastfm-analysis/worker/work"
	"github.com/undead404/lastfm-analysis/worker/data"
	"gopkg.in/natefinch/lumberjack.v2"
)

func main() {
	gotenv.Load()
	log.SetOutput(&lumberjack.Logger{
		Filename:   "logs/worker.log",
		MaxSize:    5, // megabytes
		MaxBackups: 3,
		MaxAge:     28, //days
		Compress:   true, // disabled by default
	})

	// init DB
	db, err := data.Connect()
	if err != nil {
		log.Fatal(fmt.Sprintf("Error connecting: %v \n", err))
		return
	}
	// we will close the DB connection when close the app process
	defer db.Close()

	db.AutoMigrate(data.Job{}, data.LovedTrack{}, data.Tag{}, data.Track{}, data.TrackTag{}, data.User{})
	jobs, err := data.FindCollectTasteUndone()
	if err != nil {
		log.Fatal(fmt.Sprintf("Error fetching: %v \n", err))
		return
	}
	log.Printf("Jobs: %v\n", jobs)
	// var i int
	for i :=0; i < len(*jobs); i++ {
		log.Printf("Job: %v\n", (*jobs)[i])
		err = work.Do(&(*jobs)[i])
		if err != nil {
			log.Fatal(err)
		}
	}

	// prepare device
}
