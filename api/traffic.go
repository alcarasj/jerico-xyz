package main

import (
	"encoding/json"
	"sort"
	"strings"
	"time"
)

func (timeInterval TimeInterval) hasEnded(currentDate time.Time) bool {
	switch timeInterval {
	case Weekly:
		return currentDate.Weekday() == time.Monday
	case Monthly:
		return currentDate.Day() == 1
	case Yearly:
		return currentDate.Day() == 1 && currentDate.Month() == time.January
	default:
		return true
	}
}

func (data ViewCounterData) AggregateViews(timeInterval TimeInterval, intervals int, callerIP string) TrafficData {
	result := make(TrafficData)
	nIntervalsCounted := 0
	intervalTotalViews := 0
	intervalUniqueViews := 0
	intervalSelfViews := 0
	seenIPs := make(map[string]bool)

	sortedDates := make([]string, len(data))
	i := 0
	for key := range data {
		sortedDates[i] = key
		i++
	}
	sort.Sort(sort.Reverse(sort.StringSlice(sortedDates)))

	if timeInterval == Daily {
		for _, date := range sortedDates {
			result[date] = data[date].AggregateViews(callerIP, nil)
			nIntervalsCounted++
			if nIntervalsCounted >= intervals {
				break
			}
		}
	} else {
		for index, date := range sortedDates {
			dayData := data[date].AggregateViews(callerIP, seenIPs)
			intervalTotalViews += dayData.TotalViews
			intervalUniqueViews += dayData.UniqueViews
			intervalSelfViews += dayData.SelfViews

			timeObj, _ := time.Parse("2006-01-02", date)
			isLastDayEntry := index+1 == len(sortedDates)
			if timeInterval.hasEnded(timeObj) || isLastDayEntry {
				result[date] = TrafficDatapoint{
					TotalViews:  intervalTotalViews,
					UniqueViews: intervalUniqueViews,
					SelfViews:   intervalSelfViews,
				}
				intervalTotalViews = 0
				intervalUniqueViews = 0
				intervalSelfViews = 0
				nIntervalsCounted++
			}
			if nIntervalsCounted >= intervals {
				break
			}
		}
	}
	return result
}

func (dayEntry ViewCounterDayEntry) AggregateViews(callerIP string, seenIPs map[string]bool) TrafficDatapoint {
	dayTotalViews := 0
	dayUniqueViews := 0
	daySelfViews := 0
	for ip, clientEntry := range dayEntry {
		totalClientViews := clientEntry.Views
		dayTotalViews += totalClientViews
		if callerIP == ip {
			daySelfViews += totalClientViews
		}

		// seenIPs map is used for determining unique views over a time period.
		if seenIPs != nil {
			_, isIPSeen := seenIPs[ip]
			if !isIPSeen {
				seenIPs[ip] = true
				dayUniqueViews++
			}
		} else {
			dayUniqueViews++
		}
	}
	return TrafficDatapoint{
		TotalViews:  dayTotalViews,
		UniqueViews: dayUniqueViews,
		SelfViews:   daySelfViews,
	}
}

func stringToTimeInterval(s string) (TimeInterval, bool) {
	switch strings.ToLower(s) {
	case "daily":
		return Daily, true
	case "weekly":
		return Weekly, true
	case "monthly":
		return Monthly, true
	case "yearly":
		return Yearly, true
	}
	return 0, false
}

func unmarshalViewCounterData(rawData interface{}) ViewCounterData {
	rawDataBytes, _ := json.Marshal(rawData)
	var result ViewCounterData
	json.Unmarshal(rawDataBytes, &result)
	return result
}
