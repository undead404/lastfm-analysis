package router

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/undead404/lastfm-analysis/server/data"
)

type CollectRequest struct {
	Username string
}

func CollectTaste(responseWriter http.ResponseWriter, request *http.Request, _ httprouter.Params) {
	if request.Method != "POST" {
		sendError(responseWriter, errors.New("only POST supported"))
		return
	}
	var collectRequest CollectRequest
	err := json.NewDecoder(request.Body).Decode(&collectRequest)
	if err != nil {
		sendError(responseWriter, err)
		return
	}
	var job = data.Job{
		Name: "collectTaste",
	}
	job.Params, err = json.Marshal(collectRequest)
	if err != nil {
		sendError(responseWriter, err)
		return
	}
	log.Println(job.Name)
	err = job.Save()
	if err != nil {
		sendError(responseWriter, err)
		return
	}
	responseWriter.WriteHeader(http.StatusCreated)
	responseWriter.Header().Set("Content-Type", "application/json")
}
