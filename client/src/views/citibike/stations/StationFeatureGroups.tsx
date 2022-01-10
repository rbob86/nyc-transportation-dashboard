import { FeatureGroup } from 'react-leaflet'
import {
    FeatureGroup as LFeatureGroup,
    CircleMarker as LCircleMarker,
} from 'leaflet'
import { CitibikeStation } from '../../../types/citibike'
import StationMarker from './StationMarker'
import { memo } from 'react'

type Props = {
    stations: CitibikeStation[]
    neighborhood: string
    setRef: (ref: LFeatureGroup<LCircleMarker>, neighborhood: string) => void
}

function StationFeatureGroups({
    stations,
    neighborhood,
    setRef,
}: Props): JSX.Element {
    return (
        <FeatureGroup
            ref={(ref) => {
                if (ref) {
                    setRef(ref, neighborhood)
                }
            }}
        >
            {stations.map((station, i) => (
                <StationMarker station={station} key={i} />
            ))}
        </FeatureGroup>
    )
}

export default memo(StationFeatureGroups)
