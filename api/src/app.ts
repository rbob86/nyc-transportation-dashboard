import express, { Request, Response } from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()
app.use(cors())
const port = 3001

app.use('/api', routes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
