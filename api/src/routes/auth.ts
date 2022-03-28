import express, { Request, Response } from 'express'
import { IEmbedSsoParams } from '@looker/sdk'
import { DelimArray } from '@looker/sdk-rtl'
import sdk from '../utils/sdk'

const router = express.Router()

router.get('/signed-url-for-embed', async (req: Request, res: Response) => {
    const src = req.query.src as string
    const params: IEmbedSsoParams = {
        target_url: `${process.env.LOOKERSDK_BASE_URL}${src}`, // https://dev.looker.rbobrowski.com/embed/dashboards-next/1?embed_domain=http%3A%2F%2Flocalhost%3A3000&sdk=2&theme=Minimal
        session_length: 3600,
        force_logout_login: true,
        external_user_id: 'embed1',
        first_name: 'Tester',
        last_name: 'McGee',
        permissions: [
            'access_data',
            // 'see_lookml_dashboards',
            // 'see_looks',
            'see_user_dashboards',
            'explore',
            // 'create_table_calculations',
            // 'save_content',
            // 'create_public_looks',
            // 'download_with_limit',
            'download_without_limit',
            // 'schedule_look_emails',
            // 'schedule_external_look_emails',
            // 'create_alerts',
            // 'follow_alerts',
            // 'send_to_s3',
            // 'send_to_sftp',
            // 'send_outgoing_webhook',
            // 'send_to_integration',
            // 'see_sql',
            // 'see_lookml',
            // 'develop',
            // 'deploy',
            // 'support_access_toggle',
            // 'use_sql_runner',
            // 'clear_cache_refresh',
            'see_drill_overlay',
            // 'manage_spaces',
            // 'manage_homepage',
            // 'manage_models',
            // 'create_prefetches',
            // 'login_special_email',
            // 'embed_browse_spaces',
            // 'embed_save_shared_space',
            // 'see_alerts',
            // 'see_queries',
            // 'see_logs',
            // 'see_users',
            // 'sudo',
            // 'see_schedules',
            // 'see_pdts',
            // 'see_datagroups',
            // 'update_datagroups',
            // 'see_system_activity',
            // 'mobile_app_access',
        ],
        models: ['nyc_transportation'],
        // group_ids: [],
        // user_timezone?: string;
        // external_group_id: 'embed_group1',
        user_attributes: { locale: 'en_US' },
    }
    console.log(params)
    const signedUrl = await sdk.ok(sdk.create_sso_embed_url(params))

    res.json(signedUrl)
})

// export declare class DelimArray<T> extends Array<T> {
//     separator: string;
//     prefix: string;
//     suffix: string;
//     constructor(items?: Array<T>, separator?: string, prefix?: string, suffix?: string);
//     static create<T>(): DelimArray<T>;
//     toString: () => string;
// }

// router.get('/test', async (req: Request, res: Response) => {
//     const response = await sdk.ok(
//         sdk.run_inline_query({
//             result_format: 'json',
//             body: {
//                 model: 'nyc_transportation',
//                 view: 'citibike_trips',
//                 fields: ['citibike_trips.start_station_name'],
//                 filters: { 'citibike_trips.start_station_id': '>60' },
//                 total: false,
//             },
//         })
//     )

//     res.json(response)
// })

export default router
