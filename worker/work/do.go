package work

import (
	"errors"

	"github.com/undead404/lastfm-analysis/worker/data"
)

func Do(job *data.Job) error {
	switch job.Name {
	case "collectTaste":
		return CollectTaste(job)
	}
	return errors.New("Wrong job name")
}
