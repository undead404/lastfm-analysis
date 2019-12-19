package router

import (
	"github.com/julienschmidt/httprouter"
	"log"
)

// NewRouter ...
func NewRouter() *httprouter.Router {
	router := httprouter.New()
	log.Println("/collect-taste init")
	// init our router
	router.POST("/collect-taste", CollectTaste)

	return router
}
