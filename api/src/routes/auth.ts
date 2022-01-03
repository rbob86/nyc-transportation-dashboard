import express, { Request, Response } from 'express'
import { IEmbedSsoParams } from '@looker/sdk'
import sdk from '../utils/sdk'

const router = express.Router()

enum EmbedType {
    Looks = 'looks',
    Explore = 'explore',
    Dashboards = 'dashboards',
    DashboardsNext = 'dashboards-next',
}

// router.get('/query', async (req: Request, res: Response) => {
//     try {
//         const query = await sdk.ok(sdk.query(1736))
//         res.json(query)
//     } catch {
//         res.status(404).send('Query not found.')
//     }
// })

router.get('/signed-url-for-embed', async (req: Request, res: Response) => {
    const src = req.query.src as string
    const components = src.substr(0, src.indexOf('?')).split('/')
    const type = components[2]
    const id = components[3]
    const params: IEmbedSsoParams = {
        target_url: `https://sandbox.looker.rbobrowski.com/${type}/${id}?embed_domain=${process.env.LOCAL_API_URL}&sdk=2`,
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
            // 'explore',
            // 'create_table_calculations',
            // 'save_content',
            // 'create_public_looks',
            // 'download_with_limit',
            // 'download_without_limit',
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
            // 'see_drill_overlay',
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
    const signedUrl = await sdk.ok(sdk.create_sso_embed_url(params))

    res.json(signedUrl)
})

// router.get('/token', async (req: Request, res: Response) => {
//     try {
//         const user = await sdk.ok(
//             sdk.user_for_credential('email', 'rbobrowski@google.com')
//         )
//         const accessToken = await sdk.ok(sdk.login_user(user.id!))
//         res.json(accessToken)
//     } catch {
//         res.status(404).send('User not found.')
//     }
// })

export default router
