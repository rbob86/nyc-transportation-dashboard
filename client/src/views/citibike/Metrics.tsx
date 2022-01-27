/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, useEffect, ChangeEvent, useRef } from 'react'
import {
    DashboardEvent,
    LookerDashboardOptions,
    LookerEmbedDashboard,
    LookerEmbedSDK,
} from '@looker/embed-sdk'
import Spinner from '../../components/Spinner'

LookerEmbedSDK.init(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    'dev.looker.rbobrowski.com',
    'http://localhost:3001/api/signed-url-for-embed'
)

enum TileType {
    Summary = 'summary',
    Detailed = 'detailed',
}

function Metrics(): JSX.Element {
    const dashboardId = 1

    // State Variables
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
    const [dashboard, setDashboard] = useState<LookerEmbedDashboard | null>(
        null
    )
    const [dashboardOptions, setDashboardOptions] =
        useState<LookerDashboardOptions | null>(null)
    const [activeTileset, setActiveTileset] = useState<TileType | null>(null)
    const [yearFilter, setYearFilter] = useState('')
    const [genderFilter, setGenderFilter] = useState('')

    // Refs
    const tilesets = useRef({
        [TileType.Summary]: [
            'Total Trip Count',
            'Distinct Bikes Used',
            'Total Trip Duration',
            'Average Trip Duration',
        ],
        [TileType.Detailed]: [
            'Total Trip Count',
            'Distinct Bikes Used',
            'Total Trip Duration',
            'Average Trip Duration',
            'Stations by Trip Count',
            'Age Group Counts by Year',
            'Gender Counts by Year',
        ],
    })

    // Effects
    useEffect(() => {
        dashboard?.updateFilters({
            'Starttime Year': yearFilter,
        })
        dashboard?.run()
    }, [dashboard, yearFilter])

    useEffect(() => {
        dashboard?.updateFilters({
            Gender: genderFilter,
        })
        dashboard?.run()
    }, [dashboard, genderFilter])

    useEffect(() => {
        if (
            dashboardOptions &&
            dashboardOptions.elements &&
            dashboardOptions.layouts &&
            activeTileset
        ) {
            const elements = dashboardOptions.elements
            const layouts = [dashboardOptions.layouts[0]]
            const tileTitles = tilesets.current[activeTileset]
            const tileIds: string[] = []

            // Retrieve ids of elements that are relevant to your currently selected tile set
            for (const elementId in elements) {
                const element = elements[elementId]
                if (element.title && tileTitles.indexOf(element.title) !== -1) {
                    tileIds.push(elementId)
                }
            }

            // Filter layouts[0].dashboard_layout_components to only include components with dashboard_element_id in tileIds
            const components = layouts[0].dashboard_layout_components.filter(
                (component) =>
                    tileIds.indexOf(
                        component.dashboard_element_id.toString()
                    ) !== -1
            )

            // Call dashboard.setOptions to display only the set of filtered components
            dashboard?.setOptions({
                layouts: [
                    {
                        ...layouts[0],
                        dashboard_layout_components: components,
                    },
                ],
            })
        }
    }, [dashboard, dashboardOptions, tilesets, activeTileset])

    useEffect(() => {
        LookerEmbedSDK.createDashboardWithId(dashboardId)
            .withNext()
            .withTheme('minimal')
            // .withFilters({
            //     'Starttime Year': '2017',
            // })
            .appendTo('#embed-dashboard')
            .on('dashboard:loaded', (event: DashboardEvent) => {
                setDashboardOptions(event.dashboard.options)
                console.log(event.dashboard.options)
                setActiveTileset(TileType.Summary)
            })
            // .on('dashboard:run:start', (event: DashboardEvent) => {})
            // .on('dashboard:run:complete', (event: DashboardEvent) => {})
            // .on('dashboard:download', (event: DashboardEvent) => {})
            // .on('dashboard:save:complete', (event: DashboardEvent) => {})
            // .on('dashboard:delete:complete', (event: DashboardEvent) => {})
            // .on('dashboard:tile:start', (event: DashboardTileEvent) => {})
            // .on('dashboard:tile:complete', (event: DashboardTileEvent) => {})
            // .on('dashboard:tile:explore', (event: DashboardTileExploreEvent) => ({cancel: false}))
            // .on('dashboard:tile:view', (event: DashboardTileViewEvent) => ({cancel: false}))
            // .on('dashboard:filters:changed', (event: DashboardEvent) => {})
            // .on('drillmenu:click', (event: DrillMenuEvent) => ({cancel: false}))
            // .on('drillmenu:download', (event: DrillMenuEvent) => ({cancel: false}))
            // .on('drillmenu:explore', (event: DrillMenuEvent) => ({cancel: false}))
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
        <div className="module module--two-col">
            {isLoadingDashboard && <Spinner />}
            <div
                id="embed-dashboard"
                className={`module__content ${
                    isLoadingDashboard ? 'hidden' : ''
                }`}
            />
            {!isLoadingDashboard && (
                <section className="module__info-panel-container">
                    <div className="module__info-panel">
                        <header className="info-panel__header">
                            <h1 className="info-panel__heading">Filters</h1>
                            <button
                                className="text-btn"
                                onClick={() => {
                                    setYearFilter('')
                                    setGenderFilter('')
                                }}
                            >
                                Reset Filters
                            </button>
                        </header>

                        <form>
                            <div className="form-group">
                                <label htmlFor="neighborhood">Year</label>
                                <select
                                    id="year"
                                    onChange={(
                                        event: ChangeEvent<HTMLSelectElement>
                                    ) => {
                                        setYearFilter(event.currentTarget.value)
                                    }}
                                    value={yearFilter}
                                >
                                    <option value="">All</option>
                                    <option value="2015">2015</option>
                                    <option value="2016">2016</option>
                                    <option value="2017">2017</option>
                                    <option value="2018">2018</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="neighborhood">Gender</label>
                                <select
                                    id="gender"
                                    onChange={(
                                        event: ChangeEvent<HTMLSelectElement>
                                    ) => {
                                        setGenderFilter(
                                            event.currentTarget.value
                                        )
                                    }}
                                    value={genderFilter}
                                >
                                    <option value="">All</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Unknown">Unknown</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="View">View</label>
                                <button
                                    className={`btn ${
                                        activeTileset === TileType.Summary
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setActiveTileset(TileType.Summary)
                                    }
                                    type="button"
                                >
                                    Summary
                                </button>
                                <button
                                    className={`btn ${
                                        activeTileset === TileType.Detailed
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setActiveTileset(TileType.Detailed)
                                    }
                                    type="button"
                                >
                                    Detailed
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Metrics
