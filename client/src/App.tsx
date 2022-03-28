import './scss/main.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardWrapper from './views/DashboardWrapper'
import CitibikeDashboard from './views/citibike/Dashboard'
import CitibikeStations from './views/citibike/stations'
import CitibikeMetrics from './views/citibike/Metrics'
import CitibikeTimelapse from './views/citibike/Timelapse'
import TaxiDashboard from './views/taxi/Dashboard'
import TaxiBla from './views/taxi/Bla'

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<DashboardWrapper />}>
                        <Route path="/" element={<CitibikeDashboard />}>
                            <Route path="/" element={<CitibikeStations />} />
                            <Route
                                path="/metrics"
                                element={<CitibikeMetrics />}
                            />
                            <Route
                                path="/timelapse"
                                element={<CitibikeTimelapse />}
                            />
                        </Route>

                        <Route path="/taxi" element={<TaxiDashboard />}>
                            <Route path="/taxi/bla" element={<TaxiBla />} />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
