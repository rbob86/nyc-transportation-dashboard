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
import StationFeatureGroups from './StationFeatureGroups'
import StatsPanel from './StatsPanel'
import FilterPanel from './FilterPanel'

function Stations(): JSX.Element {
    const mapRef = useRef<Map>()
    const allStations = useRef<CitibikeStation[]>([])
    const neighborhoods = useRef<{ [index: string]: CitibikeStation[] }>({})
    const neighborhoodNames = useRef<string[]>([])
    const featureGroupRefs: {
        [index: string]: LFeatureGroup<LCircleMarker>
    } = {}

    const [neighborhoodGeoJson, setNeighborhoodGeoJson] =
        useState<GeoJsonObject | null>(null)
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('')
    const [stationStats, setStationStats] = useState<StationStats>({
        totalTrips: 0,
        totalTripDurationInDays: 0,
        averageTripDurationInMinutes: 0,
    })

    const calculateStationStats = useCallback(() => {
        const stations =
            selectedNeighborhood === ''
                ? allStations.current
                : neighborhoods.current[selectedNeighborhood]
        let [
            totalTrips,
            totalTripDurationInDays,
            averageTripDurationInMinutes,
        ] = [0, 0, 0]
        for (const station of stations) {
            totalTrips += station.totalTrips
            totalTripDurationInDays += station.totalTripDurationInDays
            averageTripDurationInMinutes += station.averageTripDurationInMinutes
        }
        averageTripDurationInMinutes =
            averageTripDurationInMinutes / stations.length || 0
        setStationStats({
            totalTrips,
            totalTripDurationInDays,
            averageTripDurationInMinutes,
        })
    }, [selectedNeighborhood])

    useEffect(() => {
        const getMapData = async () => {
            const response = await axios.get(
                'http://localhost:3001/api/citibikes/stations/map-data'
            )

            allStations.current = response.data.stations
            for (const station of allStations.current) {
                neighborhoods.current[station.neighborhood] =
                    neighborhoods.current[station.neighborhood] || []
                neighborhoods.current[station.neighborhood].push(station)
            }
            neighborhoodNames.current = Object.keys(
                neighborhoods.current
            ).sort()

            setNeighborhoodGeoJson(response.data.neighborhoodGeoJson)
        }

        getMapData()
    }, [])

    useEffect(() => {
        calculateStationStats()
    }, [calculateStationStats])

    useEffect(() => {
        console.log(selectedNeighborhood)
        console.log(featureGroupRefs)
        console.log(featureGroupRefs[selectedNeighborhood])
        for (const neighborhood in featureGroupRefs) {
            featureGroupRefs[neighborhood].remove()
        }
        if (selectedNeighborhood in featureGroupRefs) {
            featureGroupRefs[selectedNeighborhood].addTo(mapRef.current!)
        } else {
            for (const neighborhood in featureGroupRefs) {
                featureGroupRefs[neighborhood].addTo(mapRef.current!)
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

    const addFeatureGroupRef = useCallback(
        (neighborhood: string, ref: any): void => {
            if (ref) {
                featureGroupRefs[neighborhood] = ref
            }
        },
        [featureGroupRefs]
    )

    return (
        <div className="module module--two-col">
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
                    {Object.keys(neighborhoods.current).map((neighborhood) => (
                        <StationFeatureGroups
                            key={neighborhood}
                            innerRef={addFeatureGroupRef}
                            neighborhood={neighborhood}
                            stations={neighborhoods.current[neighborhood]}
                        />
                    ))}
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
        </div>
    )
}

export default Stations
