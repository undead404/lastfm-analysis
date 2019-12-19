package work

import (
	"encoding/json"
	"github.com/undead404/lastfm-analysis/worker/data"
	lastfmUser "github.com/undead404/lastfm-analysis/worker/lastfm/user"
	"log"
	"strconv"
)

type collectTasteParams struct {
	Page int
	Username string
}

func CollectTaste(job *data.Job) error {
	params := collectTasteParams{}
	json.Unmarshal(job.Params, &params)
	user, err := data.FindOrCreateUser(params.Username)
	if err != nil {
		return err
	}
	log.Printf("%v", user)
	lovedTracks, err := lastfmUser.GetLovedTracks(user.Username)
	if err != nil {
		log.Fatal(err)
	}
	totalPages, err := strconv.Atoi(lovedTracks.Attributes.TotalPages)
	if totalPages > 1 {
		for page :=2; page<= totalPages; page += 1 {
		params, err := json.Marshal(collectTasteParams{
			Page: page,
			Username: params.Username,
		})
		if err != nil {
			log.Fatal(err)
		}
		(&data.Job{
			Name: "collectTaste",
			Params: params,
			ParentID: job.ID,
		}).Create()
	}
	}

	for i := 0; i < len(lovedTracks.Tracks); i += 1 {
		track := lovedTracks.Tracks[i]
		lovedTrack, err := user.FindOrCreateLovedTrack(track.Artist.Name, track.Name, track.Date.Uts)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("%v", lovedTrack)
	}
	return err
}
