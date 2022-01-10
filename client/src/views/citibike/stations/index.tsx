import { useEffect, useRef, useState, useCallback } from 'react'
import axios from 'axios'
import { TileLayer, MapContainer } from 'react-leaflet'
import { GeoJsonObject } from 'geojson'
import {
    Map,
    FeatureGroup as LFeatureGroup,
    CircleMarker as LCircleMarker,
} from 'leaflet'
import { CitibikeStation, StationStats } from '../../../types/citibike'
import NeighborhoodGeoJSON from './NeighborhoodGeoJSON'
import StatsPanel from './StatsPanel'
import FilterPanel from './FilterPanel'
import StationFeatureGroups from './StationFeatureGroups'
import Spinner from '../../../components/Spinner'

const getStationStats = (stations: CitibikeStation[]): StationStats => {
    let [totalTrips, totalTripDurationInDays, averageTripDurationInMinutes] = [
        0, 0, 0,
    ]
    for (const station of stations) {
        totalTrips += station.totalTrips
        totalTripDurationInDays += station.totalTripDurationInDays
        averageTripDurationInMinutes += station.averageTripDurationInMinutes
    }
    averageTripDurationInMinutes =
        averageTripDurationInMinutes / stations.length || 0
    return {
        totalTrips,
        totalTripDurationInDays,
        averageTripDurationInMinutes,
    }
}

function Stations(): JSX.Element {
    const mapRef = useRef<Map>()
    const allStations = useRef<CitibikeStation[]>([])
    const neighborhoods = useRef<{ [index: string]: CitibikeStation[] }>({})
    const neighborhoodNames = useRef<string[]>([])
    const featureGroupRefs = useRef<{
        [index: string]: LFeatureGroup<LCircleMarker>
    }>({})

    const [neighborhoodGeoJson, setNeighborhoodGeoJson] =
        useState<GeoJsonObject | null>(null)
    const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
    const [stationStats, setStationStats] = useState<StationStats>({
        totalTrips: 0,
        totalTripDurationInDays: 0,
        averageTripDurationInMinutes: 0,
    })
    const [isLoadingMap, setIsLoadingMap] = useState(true)

    const getStationStatsCallback = useCallback(() => {
        const stations =
            selectedNeighborhood === ''
                ? allStations.current
                : neighborhoods.current[selectedNeighborhood]
        setStationStats(getStationStats(stations))
    }, [selectedNeighborhood])

    useEffect(() => {
        const getMapData = async () => {
            const response = await axios.get(
                'http://localhost:3001/api/citibikes/stations/map-data'
            )

            allStations.current = response.data.stations
            setStationStats(getStationStats(allStations.current))
            for (const station of allStations.current) {
                neighborhoods.current[station.neighborhood] =
                    neighborhoods.current[station.neighborhood] || []
                neighborhoods.current[station.neighborhood].push(station)
            }
            neighborhoodNames.current = Object.keys(
                neighborhoods.current
            ).sort()

            setNeighborhoodGeoJson(response.data.neighborhoodGeoJson)
            setIsLoadingMap(false)
        }

        getMapData()
    }, [])

    useEffect(() => {
        getStationStatsCallback()
    }, [getStationStatsCallback])

    useEffect(() => {
        const map = mapRef.current
        if (map) {
            const refs = featureGroupRefs.current
            // Might be unncessary for else statement
            for (const neighborhood in refs) {
                refs[neighborhood].remove()
            }
            if (selectedNeighborhood in refs) {
                const featureGroup = refs[selectedNeighborhood]
                featureGroup.addTo(map)
                map.panTo(featureGroup.getBounds().getCenter())
            } else {
                for (const neighborhood in refs) {
                    refs[neighborhood].addTo(map)
                }
                map.panTo([40.751873, -73.977706])
            }
        }
    }, [selectedNeighborhood, featureGroupRefs])

    const handleNeighborhoodClicked = useCallback(
        (neighborhood: string): void => {
            if (neighborhoodNames.current.indexOf(neighborhood) !== -1) {
                setSelectedNeighborhood(neighborhood)
            }
        },
        []
    )

    const setFeatureGroupRef = useCallback(
        (ref: LFeatureGroup<LCircleMarker>, neighborhood: string) => {
            featureGroupRefs.current[neighborhood] = ref
        },
        []
    )

    return (
        <div className="module module--two-col">
            {isLoadingMap && <Spinner />}
            {!isLoadingMap && (
                <>
                    <div className="module__content">
                        <MapContainer
                            center={[40.751873, -73.977706]}
                            zoom={12}
                            scrollWheelZoom={false}
                            style={{ width: '100%', height: '100%' }}
                            whenCreated={(mapInstance) => {
                                mapRef.current = mapInstance
                            }}
                        >
                            <TileLayer
                                attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                                maxZoom={16}
                            />
                            {neighborhoodGeoJson &&
                                neighborhoodNames.current.length && (
                                    <NeighborhoodGeoJSON
                                        geojson={neighborhoodGeoJson}
                                        handleClick={handleNeighborhoodClicked}
                                    />
                                )}
                            {Object.keys(neighborhoods.current).map(
                                (neighborhood) => {
                                    return (
                                        <StationFeatureGroups
                                            key={neighborhood}
                                            stations={
                                                neighborhoods.current[
                                                    neighborhood
                                                ]
                                            }
                                            neighborhood={neighborhood}
                                            setRef={setFeatureGroupRef}
                                        />
                                    )
                                }
                            )}
                        </MapContainer>
                    </div>

                    <section className="module__info-panel-container">
                        <FilterPanel
                            neighborhoods={neighborhoodNames.current}
                            selectedNeighborhood={selectedNeighborhood}
                            selectNeighborhood={(neighborhood) => {
                                setSelectedNeighborhood(neighborhood)
                            }}
                            resetFilters={() => setSelectedNeighborhood('')}
                        />
                        <StatsPanel stats={stationStats} />
                    </section>
                </>
            )}
        </div>
    )
}

export default Stations
