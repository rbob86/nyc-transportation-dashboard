import { NavLink, Outlet } from 'react-router-dom'

function Dashboard(): JSX.Element {
    return (
        <>
            <section className="content">
                <h1 className="content__heading">Citibike Insights</h1>
                <nav className="tabs">
                    <ul>
                        <li>
                            <NavLink to="/dashboard/citibike/stations">
                                Stations
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/citibike/metrics">
                                Metrics
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/citibike/timelapse">
                                Timelapse
                            </NavLink>
                        </li>
                    </ul>
                </nav>
                <Outlet />
            </section>
        </>
    )
}

export default Dashboard
