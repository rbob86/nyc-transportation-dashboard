import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

function DashboardWrapper(): JSX.Element {
    return (
        <div className="dashboard">
            <aside className="sidebar">
                <h1 className="sidebar__heading">
                    <NavLink to="/">
                        <span className="material-icons">insights</span> NYC
                    </NavLink>
                </h1>

                <nav>
                    <ul>
                        <li>
                            <NavLink
                                to="/dashboard/citibike/stations"
                                className="sidebar__nav-link"
                            >
                                <span className="material-icons">
                                    directions_bike
                                </span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard/taxi/bla"
                                className="sidebar__nav-link"
                            >
                                <span className="material-icons">
                                    local_taxi
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            <Outlet />
        </div>
    )
}

export default DashboardWrapper
