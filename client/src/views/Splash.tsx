import { useEffect, useRef } from 'react'
import axios from 'axios'
import SpinnerSplash from '../components/SpinnerSplash'
import { NavLink } from 'react-router-dom'

function Splash(): JSX.Element {
    const totalCitibikeRides = useRef<HTMLSpanElement>(null)
    const totalYellowTaxiTrips = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const getTotalCitibikeRides = async () => {
            const response = await axios.get(
                'http://localhost:3001/api/citibikes/rides/total'
            )

            if (totalCitibikeRides.current) {
                animateValue(totalCitibikeRides.current, 0, response.data, 1)
            }
        }

        const getTotalYellowTaxiTrips = async () => {
            const response = await axios.get(
                'http://localhost:3001/api/taxis/count'
            )

            if (totalYellowTaxiTrips.current) {
                animateValue(totalYellowTaxiTrips.current, 0, response.data, 2)
            }
        }

        getTotalCitibikeRides()
        getTotalYellowTaxiTrips()
    }, [])

    function animateValue(
        el: HTMLSpanElement,
        start: number,
        end: number,
        duration: number
    ) {
        let startTimestamp: number | null = null
        const step = (timestamp: number) => {
            timestamp = timestamp / 1000
            if (!startTimestamp) {
                startTimestamp = timestamp
            }
            const progress = Math.min(
                (timestamp - startTimestamp) / duration,
                1
            )
            el.innerHTML = Math.floor(
                progress * (end - start) + start
            ).toLocaleString('en-US')
            if (progress < 1) {
                window.requestAnimationFrame(step)
            }
        }
        window.requestAnimationFrame(step)
    }

    return (
        <div className="splash">
            <section className="splash__content">
                <aside className="splash__counters">
                    <div className="splash__counter">
                        <img
                            src="/images/icon-bike.png"
                            alt="Citibike total number of rides taken"
                        />
                        <h2>Total Citibike Rides</h2>
                        <span ref={totalCitibikeRides}>
                            <SpinnerSplash />
                        </span>
                    </div>

                    <div className="splash__counter">
                        <img
                            src="/images/icon-taxi.png"
                            alt="Yellow taxi total number of rides taken"
                        />
                        <h2>Total Yellow Taxi Trips *</h2>
                        <span ref={totalYellowTaxiTrips}>
                            <SpinnerSplash />
                        </span>
                    </div>
                </aside>

                <h1 className="splash__heading">
                    New York City
                    <br />
                    Transportation
                    <br />
                    Insights
                    <NavLink to="/dashboard/citibike/stations">
                        Explore
                        <span className="material-icons">chevron_right</span>
                    </NavLink>
                </h1>
            </section>

            <aside className="splash__disclaimer">
                <p>* Based on data from 2015 - 2018</p>
            </aside>
        </div>
    )
}

export default Splash
