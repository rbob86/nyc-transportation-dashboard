import { CircleMarker, Popup } from 'react-leaflet'
import { CitibikeStation } from '../../../types/citibike'

type Props = {
    station: CitibikeStation
}

function StationMarker({ station }: Props): JSX.Element {
    return (
        <CircleMarker
            center={station.location}
            pathOptions={{
                color: '#ffffff',
                fillColor: '#14a511',
                fillOpacity: 1,
                weight: 1,
            }}
            radius={5}
            stroke={true}
        >
            <Popup className="stations-map__popup">
                <h2>{station.name}</h2>
                <ul>
                    <li>
                        <strong>Location</strong>
                        {station.location[0]},
                        <br />
                        {station.location[1]}
                    </li>
                    <li>
                        <strong>Total Trips Taken</strong>
                        {station.totalTrips}
                    </li>
                    <li>
                        <strong>Total Trip Duration</strong>
                        {station.totalTripDurationInDays.toLocaleString(
                            'en-US',
                            {
                                maximumFractionDigits: 2,
                            }
                        )}{' '}
                        days
                    </li>
                    <li>
                        <strong>Average Trip Duration</strong>
                        {station.averageTripDurationInMinutes.toLocaleString(
                            'en-US',
                            {
                                maximumFractionDigits: 2,
                            }
                        )}{' '}
                        minutes
                    </li>
                </ul>
            </Popup>
        </CircleMarker>
    )
}

export default StationMarker
