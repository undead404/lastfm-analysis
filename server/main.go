package main

import (
	"fmt"
	//"github.com/jinzhu/gorm"
	//_ "github.com/jinzhu/gorm/dialects/postgres"
	"github.com/rs/cors"
	"github.com/undead404/lastfm-analysis/server/data"
	"github.com/undead404/lastfm-analysis/server/router"
	"github.com/subosito/gotenv"
	"gopkg.in/natefinch/lumberjack.v2"
	"log"
	"net/http"
)

func main() {
	gotenv.Load()
	log.SetOutput(&lumberjack.Logger{
		Filename:   "logs/server.log",
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

	//storage.Storage = db
	router := router.NewRouter()

	db.AutoMigrate(data.Job{})
	// prepare device

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedHeaders: []string{"Authorization", "Accept", "Content-Type"},
		AllowedMethods: []string{"PUT", "GET", "POST", "OPTIONS"},
	})

	// init server
	log.Fatal(http.ListenAndServe(":8080", c.Handler(router)))
}
