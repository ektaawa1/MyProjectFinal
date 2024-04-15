import express from 'express';
import axios from 'axios';
import {API_ACCESS_TOKEN, FITNESS_CAL_URI} from '../settings.js';
import { getLoggerInstance } from '../logger.js';


const calci_uri = FITNESS_CAL_URI
const token = API_ACCESS_TOKEN

const access_api_data = express.Router()
const logger = getLoggerInstance()


// GET request- To fetch the bmi data from the api
// https://localhost:8080/https-web-service/v1/fetch-api-data
access_api_data.get('/fetch-api-data', async (req, res) => {
  const { age, weight, height } = req.query;
  logger.info('Fetching the data from the BMI Calculator API')
  try{
    const response = await axios.get(calci_uri, {
      params: {
        age: age,
        weight: weight,
        height: height
      },
      headers: {
        'X-RapidAPI-Key': token,
        'X-RapidAPI-Host': `fitness-calculator.p.rapidapi.com`
      }
    })
    res.json(response.data)
  } catch (error){
    logger.error('Error fetching data from BMI calculator API:', error)
    res.status(500).json({ error: 'Failed to fetch data from BMI calculator API' })
  }
})

export default access_api_data