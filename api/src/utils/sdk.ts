import { LookerNodeSDK } from '@looker/sdk-node'
import dotenv from 'dotenv'

dotenv.config()

const sdk = LookerNodeSDK.init40()

export default sdk
