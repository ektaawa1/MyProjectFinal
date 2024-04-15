import cors from 'cors';
import express from 'express';
import https from 'https';
import fs from 'fs';
import 'dotenv/config'
import peopleInfo from './routes/mongo-data-access.js'
import access_api_data from './routes/fitness-calculator-access.js'
import access_bmi_data from './routes/bmi-calculator.js';
import { getLoggerInstance } from './logger.js';
import { connectToDatabase } from './database/database.js';

connectToDatabase()
const logger = getLoggerInstance()

const app = express()

const httpsOptions = {
    key: fs.readFileSync('./ssl/key.pem'),
    cert: fs.readFileSync('./ssl/cert.pem'),
    passphrase: '1234'
}

const server = https.createServer(httpsOptions,app)
app.use(cors()) //now our api can be used in any port
app.use(express.json())
//app.use('/https-web-service/v1', startup)
app.use('/https-web-service/v1', peopleInfo)
app.use('/https-web-service/v1', access_api_data)
app.use('/https-web-service/v1', access_bmi_data)


server.listen(8080, () => {
    logger.info('Server is up')
})
