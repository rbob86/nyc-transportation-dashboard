import { FeatureGroup } from 'react-leaflet'

import { CitibikeStation } from '../../../types/citibike'
import StationMarker from './StationMarker'
import { memo } from 'react'

type Props = {
    neighborhood: string
    innerRef: any
    stations: CitibikeStation[]
}

function StationFeatureGroups({
    neighborhood,
    innerRef,
    stations,
}: Props): JSX.Element {
    // const refs: {
    //     [index: string]: LFeatureGroup<LCircleMarker>
    // } = {}
    console.log('hello')

    return (
        <FeatureGroup ref={innerRef}>
            {stations.map((station, i) => (
                <StationMarker station={station} key={i} />
            ))}
        </FeatureGroup>
    )
}

export default memo(StationFeatureGroups)
