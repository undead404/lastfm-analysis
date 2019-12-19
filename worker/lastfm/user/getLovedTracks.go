package user

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/google/go-querystring/query"
)

type userGetLovedTracksParams struct {
	ApiKey string `url:"api_key"`
	Format string `url:"format"`
	Method string `url:"method"`
	User   string `url:"user"`
}

var URL_BASE string = "http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=undeadum&api_key=991eacc4ca058d68ec446983c0ddd04d&format=json"
var client *http.Client

type LovedTracks struct {
	Attributes struct {
		Total      string `json:"total"`
		TotalPages string `json:"totalPages"`
	} `json:"@attr"`
	Tracks []*struct {
		Artist struct {
			Name string `json:"name"`
		} `json:"artist"`
		Date struct {
			Uts string `json:"uts"`
		} `json:"date"`
		Images []*struct {
			Url string `json:"#text"`
		} `json:"image"`
		Name string `json:"name"`
	} `json:"track"`
}
type UserGetLovedTracksResponse struct {
	ErrorMessage    string      `json:"message"`
	LovedTracksData LovedTracks `json:"lovedtracks"`
}

func checkClient() {
	if client == nil {
		client = &http.Client{}
	}
}

func GetLovedTracks(username string) (*LovedTracks, error) {
	checkClient()
	params := userGetLovedTracksParams{
		ApiKey: os.Getenv("LASTFM_API_KEY"),
		Format: "json",
		Method: "user.getLovedTracks",
		User:   username,
	}
	urlParams, err := query.Values(params)
	if err != nil {
		return nil, err
	}
	url := URL_BASE + urlParams.Encode()
	request, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	response, err := client.Do(request)
	if err != nil {
		return nil, err
	}
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	var data UserGetLovedTracksResponse
	err = json.Unmarshal(body, &data)
	if err != nil {
		return nil, err
	}
	if data.ErrorMessage != "" {
		return nil, errors.New(data.ErrorMessage)
	}
	log.Printf("%v", data.LovedTracksData.Tracks)
	return &data.LovedTracksData, nil
}
