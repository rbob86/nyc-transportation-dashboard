export interface CitibikeStation {
    id: string
    name: string
    location: [number, number]
    totalTrips: number
    totalTripDurationInDays: number
    averageTripDurationInMinutes: number
    neighborhood: string
}

export interface StationStats {
    totalTrips: number
    totalTripDurationInDays: number
    averageTripDurationInMinutes: number
}
