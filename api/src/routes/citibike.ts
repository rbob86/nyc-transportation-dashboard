import express, { Request, Response } from 'express'
import sdk from '../utils/sdk'
import axios from 'axios'
import { Feature, Polygon, MultiPolygon } from 'geojson'
import { getStations } from '../api/citibike'
import { transformStations } from '../utils/transformations'
import { CitibikeStation } from '../types/citibike'

const router = express.Router()

router.get(
    '/citibikes/rides/total',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await sdk.ok(
                sdk.run_inline_query({
                    result_format: 'json',
                    body: {
                        model: 'nyc_transportation',
                        view: 'citibike_trips',
                        fields: ['citibike_trips.count'],
                        total: false,
                    },
                    cache: true,
                })
            )
            const value = response[0] as unknown as { [key: string]: any }

            res.send(value['citibike_trips.count'].toString())
        } catch (e: any) {
            res.status(500)
            res.send(e.message)
        }
    }
)

function isStationInNeighborhood(
    station: CitibikeStation,
    neighborhood: Feature<Polygon | MultiPolygon>
): boolean {
    const { type, coordinates } = neighborhood.geometry

    if (type === 'MultiPolygon') {
        for (const coordinate of coordinates) {
            const polygon = coordinate[0]
            if (isPointInsidePolygon(station.location, polygon)) {
                return true
            }
        }
    } else if (type === 'Polygon') {
        const polygon = coordinates[0]
        if (isPointInsidePolygon(station.location, polygon)) {
            return true
        }
    }

    return false
}

function isPointInsidePolygon(latLng: any, polyPoints: any): boolean {
    const [x, y] = latLng
    let inside = false

    for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
        const xi = polyPoints[i][1],
            yi = polyPoints[i][0]
        const xj = polyPoints[j][1],
            yj = polyPoints[j][0]

        // prettier-ignore
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside
    }

    return inside
}

router.get(
    '/citibikes/stations/map-data',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const responses = await Promise.all([
                sdk.ok(getStations()),
                axios.get(
                    'https://raw.githubusercontent.com/grantpezeshki/NYC-topojson/master/NTA.geojson'
                ),
            ])
            const stations = transformStations(responses[0] as unknown as any[])
            const neighborhoods = responses[1].data

            neighborhoods.features.map((neighborhood: any) => {
                stations.forEach((station) => {
                    if (isStationInNeighborhood(station, neighborhood)) {
                        const neighborhoodName = neighborhood.properties.NTAName
                        station.neighborhood = neighborhoodName
                    }
                })
            })

            res.json({
                stations,
                neighborhoodGeoJson: neighborhoods,
            })
        } catch (e: any) {
            res.status(500)
            res.send(e.message)
        }
    }
)

export default router
