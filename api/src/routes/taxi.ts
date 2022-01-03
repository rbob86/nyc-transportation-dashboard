import express, { Request, response, Response } from 'express'
import sdk from '../utils/sdk'

const router = express.Router()

router.get(
    '/taxis/count',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await sdk.ok(
                sdk.run_inline_query({
                    result_format: 'json',
                    body: {
                        model: 'nyc_transportation',
                        view: 'taxi_yellow_trips',
                        fields: ['taxi_yellow_trips.count'],
                        total: false,
                    },
                    cache: true,
                })
            )
            const value = response[0] as unknown as { [key: string]: any }

            res.send(value['taxi_yellow_trips.count'].toString())
        } catch (e: any) {
            res.status(500)
            res.send(e.message)
        }
    }
)

router.get(
    '/taxis/total-fare',
    async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await sdk.ok(
                sdk.run_inline_query({
                    result_format: 'json',
                    body: {
                        model: 'nyc_transportation',
                        view: 'taxi_yellow_trips',
                        fields: ['taxi_yellow_trips.total_amount_all_trips'],
                        total: false,
                    },
                    cache: true,
                })
            )
            const value = response[0] as unknown as { [key: string]: any }

            res.send(
                value['taxi_yellow_trips.total_amount_all_trips'].toString()
            )
        } catch (e: any) {
            res.status(500)
            res.send(e.message)
        }
    }
)

export default router
