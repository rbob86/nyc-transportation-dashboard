// Can any combination of:
//   access_data
//   see_looks
//   see_user_dashboards
//   see_lookml_dashboards
//   explore
//   create_table_calculations
//   download_with_limit
//   download_without_limit
//   see_drill_overlay
//   see_sql
//   save_content
//   embed_browse_spaces
//   schedule_look_emails
//   send_to_sftp
//   send_to_s3
//   send_outgoing_webhook
//   schedule_external_look_emails
type LookerUserPermission = string

interface LookerEmbedUser {
    external_user_id: string
    first_name?: string
    last_name?: string
    session_length: number
    force_logout_login?: boolean
    permissions: LookerUserPermission[]
    models: string[]
    group_ids?: number[]
    external_group_id?: string
    user_attributes?: { [key: string]: any }
    access_filters: { [key: string]: any }
}

export default LookerEmbedUser
