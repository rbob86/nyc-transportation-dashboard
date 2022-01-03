import { NavLink, Outlet } from 'react-router-dom'

function Dashboard(): JSX.Element {
    return (
        <>
            <section className="content">
                <h1 className="content__heading">Yellow Taxi Insights</h1>
                <nav className="tabs">
                    <ul>
                        <li>
                            <NavLink to="/dashboard/taxi/bla">Bla</NavLink>
                        </li>
                    </ul>
                </nav>
                <Outlet />
            </section>
        </>
    )
}

export default Dashboard
