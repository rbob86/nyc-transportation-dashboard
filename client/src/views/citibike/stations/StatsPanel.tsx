import { StationStats } from '../../../types/citibike'

type Props = {
    stats: StationStats
}

function StatsPanel({ stats }: Props): JSX.Element {
    return (
        <div className="module__info-panel">
            <header className="info-panel__header">
                <h1 className="info-panel__heading">Stats</h1>
            </header>
            <ul>
                <li>
                    <strong>Total Trips Taken</strong>
                    {stats.totalTrips.toLocaleString('en-US')}
                </li>
                <li>
                    <strong>Total Trip Duration</strong>
                    {stats.totalTripDurationInDays.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                    })}{' '}
                    days
                </li>
                <li>
                    <strong>Average Trip Duration</strong>
                    {stats.averageTripDurationInMinutes.toLocaleString(
                        'en-US',
                        {
                            maximumFractionDigits: 2,
                        }
                    )}{' '}
                    minutes
                </li>
            </ul>
        </div>
    )
}

export default StatsPanel
