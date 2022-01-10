import express, { Request, response, Response } from 'express'
import sdk from '../utils/sdk'

const router = express.Router()

router.get(
    '/dashboards',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const apiDashboards = await sdk.ok(sdk.all_dashboards())
            const dashboards = []

            for (const apiDashboard of apiDashboards) {
                if (apiDashboard.id && apiDashboard.title) {
                    const dashboard = {
                        id: apiDashboard.id,
                        title: apiDashboard.title,
                        thumbnail: '',
                    }
                    dashboard.thumbnail = await sdk.ok(
                        sdk.content_thumbnail({
                            type: 'dashboard',
                            resource_id: apiDashboard.id,
                        })
                    )
                    dashboards.push(dashboard)
                }
            }

            res.send(dashboards)
        } catch (e: any) {
            res.status(500)
            res.send(e.message)
        }
    }
)

router.get(
    '/dashboards/:id',
    async (req: Request, res: Response): Promise<void> => {
        if (!req.params.id) {
            res.status(400)
            res.send('Dashboard id is required.')
            return
        }

        try {
            const dashboard = await sdk.ok(sdk.dashboard(req.params.id))
            res.send(dashboard)
        } catch (e: any) {
            res.status(500)
            res.send(e.message)
        }
    }
)

export default router
