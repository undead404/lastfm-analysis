package router

import (
	"fmt"
	"net/http"
)

func sendError(responseWriter http.ResponseWriter, err error) {
	responseWriter.WriteHeader(http.StatusBadRequest)
	responseWriter.Header().Set("Content-Type", "application/json")
	responseWriter.Write([]byte(fmt.Sprintf(`{"error": "%s"}`, err.Error())))
}
