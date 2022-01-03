import { GeoJsonObject } from 'geojson'
import { memo } from 'react'
import { GeoJSON } from 'react-leaflet'

type Props = {
    geojson: GeoJsonObject
    handleClick: (neighborhood: string) => void
}

function NeighborhoodGeoJson({ geojson, handleClick }: Props): JSX.Element {
    return (
        <GeoJSON
            attribution="&copy; credits due..."
            data={geojson}
            eventHandlers={{
                click: (event) => {
                    handleClick(event.sourceTarget.feature.properties.NTAName)
                },
            }}
            style={(feature) => {
                if (feature) {
                    switch (feature.properties.BoroName) {
                        case 'Manhattan':
                            return {
                                color: '#916aba',
                                weight: 1,
                            }
                        case 'Brooklyn':
                            return {
                                color: '#2a6ba5',
                                weight: 1,
                            }
                        case 'Queens':
                            return {
                                color: '#e75fa0',
                                weight: 1,
                            }
                        case 'Bronx':
                            return {
                                color: '#ff6f63',
                                weight: 1,
                            }
                        case 'Staten Island':
                            return {
                                color: '#ffa600',
                                weight: 1,
                            }
                        default:
                            return {
                                color: '#888888',
                                weight: 1,
                            }
                    }
                } else {
                    return { color: '#888888' }
                }
            }}
        />
    )
}

export default memo(NeighborhoodGeoJson)
