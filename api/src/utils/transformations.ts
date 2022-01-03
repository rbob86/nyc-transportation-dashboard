import { CitibikeStation } from '../types/citibike'

const transformStations = (stations: any[]): CitibikeStation[] => {
    return stations.map((station) => {
        return {
            id: station['citibike_trips.start_station_id'],
            name: station['citibike_trips.start_station_name'],
            location: station['citibike_trips.start_station_location'],
            totalTrips: station['citibike_trips.count'],
            totalTripDurationInDays:
                station['citibike_trips.total_tripduration_in_days'],
            averageTripDurationInMinutes:
                station['citibike_trips.average_tripduration_in_minutes'],
        }
    })
}

export { transformStations }
