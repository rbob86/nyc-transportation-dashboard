import {
    AuthSession,
    BrowserTransport,
    AuthToken,
    IApiSettings,
    IRequestProps,
    ITransport,
} from '@looker/sdk-rtl'

export class CorsSession extends AuthSession {
    token_endpoint = ''
    activeToken = new AuthToken()

    constructor(settings: IApiSettings, transport?: ITransport) {
        super(settings, transport || new BrowserTransport(settings))

        this.token_endpoint = settings.token_endpoint
    }

    /**
     * first function called when using the sdk
     * calls get token
     */
    async authenticate(props: IRequestProps): Promise<IRequestProps> {
        const token = await this.getToken()
        if (token && token.access_token) {
            props.mode = 'cors'
            delete props.credentials
            props.headers = {
                ...props.headers,
                Authorization: `Bearer ${this.activeToken.access_token}`,
            }
        }
        return props
    }
    /**
     * abstract method of AuthSession class, i.e. needs to be overridden
     * if there's not an authenticated token, call endpoint to get one
     */
    async getToken(): Promise<AuthToken> {
        if (!this.isAuthenticated()) {
            const token = await fetch(this.token_endpoint)
            this.activeToken.setToken(await token.json())
        }
        return this.activeToken
    }

    /**
     * returns true only if you have token and not expired
     */
    isAuthenticated(): boolean {
        const token = this.activeToken
        if (!(token && token.access_token)) return false
        return token.isActive()
    }
}

export default CorsSession
