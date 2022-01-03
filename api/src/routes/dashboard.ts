import express, { Request, response, Response } from 'express'
import sdk from '../utils/sdk'

const router = express.Router()

// router.get(
//     '/complaints/downloads/last-five-years',
//     async (req: Request, res: Response): Promise<void> => {
//         const years = [2021, 2020, 2019, 2018, 2017]
//         const tasks = years.map((year) => {
//             return {
//                 dashboard_id: '3',
//                 result_format: 'pdf',
//                 body: {
//                     dashboard_filters: `Date+Sent+to+Company+Date=${year}`,
//                     dashboard_style: 'tiled',
//                 },
//                 width: 612,
//                 height: 792,
//             }
//         })

//         try {
//             const responses = await Promise.all([
//                 sdk.ok(sdk.create_dashboard_render_task(tasks[0])),
//                 sdk.ok(sdk.create_dashboard_render_task(tasks[1])),
//                 sdk.ok(sdk.create_dashboard_render_task(tasks[2])),
//                 sdk.ok(sdk.create_dashboard_render_task(tasks[3])),
//                 sdk.ok(sdk.create_dashboard_render_task(tasks[4])),
//             ])
//             const queryIds = responses.map((response) => response.id!)
//             // const pdf = await sdk.ok(sdk.render_task_results(queryIds[0]))

//             console.log('-----')
//             console.log(queryIds[0])
//             console.log('-----')

//             // res.setHeader('Content-type', 'application/pdf')
//             res.send('bla')
//         } catch (e) {
//             res.send(e)
//         }
//     }
// )

// router.get(
//     '/complaints/years',
//     async (req: Request, res: Response): Promise<void> => {
//         const response = await sdk.ok(
//             sdk.run_inline_query({
//                 result_format: 'json',
//                 body: {
//                     model: 'cfpb_complaints',
//                     view: 'complaints',
//                     fields: ['complaint_database.date_sent_to_company_year'],
//                     sorts: [
//                         'complaint_database.date_sent_to_company_year desc',
//                     ],
//                 },
//             })
//         )
//         const years = (response as unknown as string[]).map((yearObject) => {
//             return Object.values(yearObject)[0]
//         })

//         res.json(years)
//     }
// )

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
