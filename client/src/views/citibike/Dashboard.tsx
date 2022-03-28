import { NavLink, Outlet } from 'react-router-dom'

function Dashboard(): JSX.Element {
    return (
        <>
            <section className="content">
                <h1 className="content__heading">Citibike Insights</h1>
                <nav className="tabs">
                    <ul>
                        <li>
                            <NavLink to="/">Stations</NavLink>
                        </li>
                        <li>
                            <NavLink to="/metrics">Metrics</NavLink>
                        </li>
                        <li>
                            <NavLink to="/timelapse">Timelapse</NavLink>
                        </li>
                    </ul>
                </nav>
                <Outlet />
            </section>
        </>
    )
}

export default Dashboard
