import express, { query, Request, response, Response } from 'express'
import sdk from '../utils/sdk'
import xlsx, { WorkSheet } from 'node-xlsx'
import fs from 'fs'

const router = express.Router()

// router.get('/test/render-dashboard', async (req: Request, res: Response): Promise<void> => {
//     try {
//         const render = await sdk.ok(
//             sdk.create_dashboard_render_task({
//                 // @ts-ignore
//                 dashboard_id: 'nyc_transportation::test_lookml_dashboard',
//                 result_format: 'pdf',
//                 body: {
//                     dashboard_style: 'tiled',
//                 },
//                 // @ts-ignore
//                 width: '800',
//                 // @ts-ignore
//                 height: '600',
//                 pdf_paper_size: 'letter',
//             })
//         )
//         res.send(render)
//     } catch (e: any) {
//         res.status(500)
//         res.send(e.message)
//     }
// })

// router.get(
//     '/test/run-scheduled-plan-once',
//     async (req: Request, res: Response): Promise<void> => {
//         try {
//             const render = await sdk.ok(
//                 sdk.scheduled_plan_run_once({
//                     // @ts-ignore
//                     dashboard_id: 'nyc_transportation::test_lookml_dashboard',
//                     result_format: 'pdf',
//                     body: {
//                         dashboard_style: 'tiled',
//                     },
//                     // @ts-ignore
//                     width: '800',
//                     // @ts-ignore
//                     height: '600',
//                     pdf_paper_size: 'letter',
//                 })
//             )
//             res.send(render)
//         } catch (e: any) {
//             res.status(500)
//             res.send(e.message)
//         }
//     }
// )

// router.get(
//     '/test/dashboard-as-csv',
//     async (req: Request, res: Response): Promise<void> => {
//         try {
//             const dashboard = await sdk.ok(sdk.dashboard('2'))
//             const filters = req.query.filters_string as {}
//             const { dashboard_elements } = dashboard
//             const sheets: WorkSheet<unknown>[] = []

//             if (dashboard_elements && dashboard_elements.length) {
//                 const pngs = []
//                 for (const element of dashboard_elements) {
//                     const { query } = element

//                     if (!query) continue

//                     delete query.client_id

//                     query.filters = {
//                         ...query.filters, // Make sure you include any existing built-in filters for that visualization
//                         ...filters,
//                         'citibike_trips.gender': 'Male',
//                     }

//                     const png = await sdk.ok(
//                         sdk.run_inline_query({
//                             body: query!,
//                             result_format: 'png',
//                         })
//                     )
//                     pngs.push(png)
//                 }

//                 for (const png of pngs) {
//                     fs.writeFile('image.png', png, 'binary', (err) => {
//                         //
//                     })
//                 }
//             }
//         } catch (e: any) {
//             res.status(500)
//             res.send(e.message)
//         }
//     }
// )

router.get('/test', async (req: Request, res: Response): Promise<void> => {
    try {
        const dashboard = await sdk.ok(sdk.dashboard('2'))
        const queryIds = dashboard.dashboard_elements?.map((e) => e.query_id)

        const renderIds = []
        if (queryIds) {
            for (const queryId of queryIds) {
                const render = await sdk.ok(
                    sdk.create_query_render_task(1283, 'png', 300, 300)
                )

                if (render.id) {
                    renderIds.push(render.id)
                }
            }
        }

        console.log(renderIds)

        // let rendered = []
        // while (rendered.length !== 3) {
        //     for (const renderId of renderIds) {
        //         if (rendered.indexOf(renderId) === -1) {
        //             const response = await sdk.ok(sdk.render_task(renderId))
        //             console.log(response.status)
        //             if (response.status === 'complete') {
        //                 rendered.push(renderId)
        //             }
        //         }
        //     }
        //     await new Promise((r) => setTimeout(r, 1000))
        // }
        res.send('okkk')
    } catch (e: any) {
        res.status(500)
        res.send(e.message)
    }
})

export default router
