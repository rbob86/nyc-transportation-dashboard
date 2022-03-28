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
    const dashboardId = 13

    // State Variables
    const [isLoadingDashboard, setIsLoadingDashboard] = useState(true)
    const [dashboard, setDashboard] = useState<LookerEmbedDashboard | null>(
        null
    )
    const [dashboardOptions, setDashboardOptions] =
        useState<LookerDashboardOptions | null>(null)
    const [activeTileset, setActiveTileset] = useState<TileType | null>(null)
    const [activeTile, setActiveTile] = useState<string | null>(null)
    const [yearFilter, setYearFilter] = useState('')
    const [genderFilter, setGenderFilter] = useState('')
    const [tileNames, setTileNames] = useState<string[]>([])

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
    // useEffect(() => {
    //     dashboard?.updateFilters({
    //         'Starttime Year': yearFilter,
    //     })
    //     dashboard?.run()
    // }, [dashboard, yearFilter])

    // useEffect(() => {
    //     dashboard?.updateFilters({
    //         Gender: genderFilter,
    //     })
    //     dashboard?.run()
    // }, [dashboard, genderFilter])

    // setTimeout(() => {
    //     window.postMessage('message', '*')
    // }, 4000)

    useEffect(() => {
        if (
            dashboardOptions &&
            dashboardOptions.elements &&
            dashboardOptions.layouts &&
            activeTile
        ) {
            const elements = dashboardOptions.elements
            const layouts = [dashboardOptions.layouts[0]]
            // let tileId: string
            const tileIds: string[] = []

            for (const elementId in elements) {
                const element = elements[elementId]
                if (element.title && element.title !== activeTile) {
                    tileIds.push(elementId)
                }
            }

            // Filter layouts[0].dashboard_layout_components to only include components with dashboard_element_id in tileIds
            // const components = layouts[0].dashboard_layout_components.filter(
            //     (component) =>
            //         component.dashboard_element_id.toString() === tileId
            // )
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
    }, [dashboard, dashboardOptions, activeTile])

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
            // .withNext()
            .withTheme('minimal')
            .appendTo('#embed-dashboard')
            .on('dashboard:run:complete', (event: DashboardEvent) => {
                const { options } = event.dashboard
                const { elements } = options

                if (elements) {
                    const titles = Object.values(elements).map(
                        (e) => e.title as string
                    )
                    setTileNames(titles)
                }

                setDashboardOptions(options)
            })
            // .on('dashboard:filters:changed', (event: DashboardEvent) => {
            //     // console.log(event)
            // })
            // .on('explore:run:complete', (event: ExploreEvent) => {

            // })
            .build()
            .connect()
            .then((dashboard) => {
                setDashboard(dashboard)
                setIsLoadingDashboard(false)
            })
            .catch((error) => {
                console.log(error)
            })

        // window.onmessage = function (e) {
        //     const message = e.data.toString()
        //     if (message.indexOf('Measure:') !== -1) {
        //         const measure = message.split(': ')[1]
        //         setMeasure(measure)
        //         //  slideOutWindow()
        //     }
        //     // alert('test')
        //     // if (e.data == 'hello') {
        //     //     alert('It works!')
        //     // }
        // }

        // // window.addEventListener(
        //     'message',
        //     (event) => {
        //         // Do we trust the sender of this message?  (might be
        //         // different from what we originally opened, for example).
        //         // if (event.origin !== "http://example.com")
        //         //   return;

        //         console.log('1111111')

        //         // event.source is popup
        //         // event.data is "hi there yourself!  the secret response is: rheeeeet!"
        //     },
        //     false
        // )
    }, [])

    return (
        <>
            <div className="buttons">
                {tileNames.map((title) => (
                    <button key={title} onClick={() => setActiveTile(title)}>
                        {title}
                    </button>
                ))}
            </div>

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
                                    <label htmlFor="neighborhood">
                                        Campaign
                                    </label>
                                    <select
                                        id="year"
                                        onChange={(
                                            event: ChangeEvent<HTMLSelectElement>
                                        ) => {
                                            setYearFilter(
                                                event.currentTarget.value
                                            )
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
                                    <label htmlFor="neighborhood">
                                        Geography
                                    </label>
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
                            </form>
                        </div>
                    </section>
                )}
            </div>
        </>
    )
}

export default Metrics
