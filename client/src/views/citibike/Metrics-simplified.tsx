/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, useEffect } from 'react'
import {
    DashboardEvent,
    LookerEmbedDashboard,
    LookerEmbedSDK,
} from '@looker/embed-sdk'
import Spinner from '../../components/Spinner'

LookerEmbedSDK.init(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    'dev.looker.rbobrowski.com',
    'http://localhost:3001/api/signed-url-for-embed'
)

function Metrics(): JSX.Element {
    const dashboardId = 13

    // State Variables
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
    const [dashboard, setDashboard] = useState<LookerEmbedDashboard | null>(
        null
    )

    useEffect(() => {
        LookerEmbedSDK.createDashboardWithId(dashboardId)
            .withNext()
            .withTheme('minimal')
            .appendTo('#embed-dashboard')
            .on('dashboard:run:complete', (event: DashboardEvent) => {
                // do something
            })
            .on('dashboard:filters:changed', (event: DashboardEvent) => {
                // do something
            })
            .build()
            .connect()
            .then((dashboard) => {
                setDashboard(dashboard)
                setIsLoadingDashboard(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <>
            <div className="module module--two-col">
                {isLoadingDashboard && <Spinner />}
                <div
                    id="embed-dashboard"
                    className={`module__content ${
                        isLoadingDashboard ? 'hidden' : ''
                    }`}
                />
            </div>
        </>
    )
}

export default Metrics
