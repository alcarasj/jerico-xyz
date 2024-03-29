package main

import (
	"log"
	"time"
)

const DEFAULT_TTL_SECS = 300

type CacheEntry struct {
	Value       interface{}
	LastUpdated time.Time
}

type Cache struct {
	Entries        map[string]CacheEntry
	DefaultTTLSecs int
}

func NewCache() Cache {
	return Cache{
		Entries:        make(map[string]CacheEntry),
		DefaultTTLSecs: DEFAULT_TTL_SECS,
	}
}

func (c Cache) Set(key string, value interface{}) {
	now := time.Now()
	entry := c.Entries[key]
	entry.Value = value
	entry.LastUpdated = now
	c.Entries[key] = entry
}

func (c Cache) Get(key string, fetchFn func() (interface{}, error)) (interface{}, error) {
	now := time.Now()
	entry, wasFound := c.Entries[key]
	if wasFound && now.Sub(entry.LastUpdated) <= time.Duration(c.DefaultTTLSecs)*time.Second {
		log.Printf("Cache hit for key %s", key)
		return entry.Value, nil
	} else {
		log.Printf("Cache miss for key %s", key)
		result, err := fetchFn()
		if err != nil {
			return nil, err
		}
		c.Set(key, result)
		return result, nil
	}
}
