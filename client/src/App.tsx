import './scss/main.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Splash from './views/Splash'
import DashboardWrapper from './views/DashboardWrapper'
import CitibikeDashboard from './views/citibike/Dashboard'
import CitibikeStations from './views/citibike/stations'
import CitibikeMetrics from './views/citibike/Metrics'
import CitibikeHeatmap from './views/citibike/Heatmap'
import TaxiDashboard from './views/taxi/Dashboard'
import TaxiBla from './views/taxi/Bla'

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Splash />} />
                    <Route path="/dashboard" element={<DashboardWrapper />}>
                        <Route
                            path="/dashboard/citibike"
                            element={<CitibikeDashboard />}
                        >
                            <Route
                                path="/dashboard/citibike/stations"
                                element={<CitibikeStations />}
                            />
                            <Route
                                path="/dashboard/citibike/metrics"
                                element={<CitibikeMetrics />}
                            />
                            <Route
                                path="/dashboard/citibike/heatmap"
                                element={<CitibikeHeatmap />}
                            />
                        </Route>

                        <Route
                            path="/dashboard/taxi"
                            element={<TaxiDashboard />}
                        >
                            <Route
                                path="/dashboard/taxi/bla"
                                element={<TaxiBla />}
                            />
                        </Route>
                    </Route>
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
