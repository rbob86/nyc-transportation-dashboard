import { useState, useEffect } from 'react'
import { LookerEmbedDashboard, LookerEmbedSDK } from '@looker/embed-sdk'
import Spinner from '../../components/Spinner'

LookerEmbedSDK.init(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    'sandbox.looker.rbobrowski.com',
    'http://localhost:3001/api/signed-url-for-embed'
)

function Metrics(): JSX.Element {
    const dashboardId = 1
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dashboard, setDashboard] = useState<LookerEmbedDashboard | null>(
        null
    )

    useEffect(() => {
        LookerEmbedSDK.createDashboardWithId(dashboardId)
            .withNext()
            .withTheme('nyc_transportation_hidden_filters')
            .withFilters({
                'Date Sent to Company Date': '2020',
            })
            .appendTo('#embed-dashboard')
            .build()
            .connect()
            .then((dashboard) => {
                setDashboard(dashboard)
                setIsLoadingDashboard(false)
            })
            .catch((error) => {
                // console.error('An unexpected error occurred', error)
            })
    }, [])

    return (
        <div className="module">
            {isLoadingDashboard && <Spinner />}
            <div
                id="embed-dashboard"
                className={`module__content ${
                    isLoadingDashboard ? 'hidden' : ''
                }`}
            />
        </div>
    )
}

export default Metrics
