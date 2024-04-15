import express from 'express';
import axios from 'axios';
import {getPeopleInfo2024Database} from '../database/database.js'
import { getLoggerInstance } from '../logger.js';
import {API_ACCESS_TOKEN, FITNESS_CAL_URI} from '../settings.js';

const calci_uri = FITNESS_CAL_URI
const token = API_ACCESS_TOKEN

const access_bmi_data = express.Router()
const logger = getLoggerInstance()

//function to calculate BMI for each person from database
const calculateBMI= async (p) => {
    try{
        const {age, current_weight, height} = p
        const resp = await axios.get(calci_uri, {
            params: {
                age: age,
                weight: current_weight,
                height: height
            }, 
            headers: {
                'X-RapidAPI-Key': token,
                'X-RapidAPI-Host': `fitness-calculator.p.rapidapi.com`
            }
        })
        return resp.data
    } 
    catch (err) {
        logger.error("Error encountered while calculating BMI", err)
        return null
    }
}

//GET Request- To calculate the BMI data for each record in database and store it in a collection 'bmiResults'
// https://localhost:8080/https-web-service/v1/calculate-bmi
access_bmi_data.get('/calculate-bmi', async (req, resp) => {
    try {
        // Fetching people data from MongoDB
        const peopleInfoDatabase = getPeopleInfo2024Database();
        const peopleCollection = await peopleInfoDatabase.collection('people');
        const peopleData = await peopleCollection.find().toArray();

        // Calculate BMI for each person
        const bmiResults = [];
        for (const person of peopleData) {
            //console.log("single person data", person)
            const bmiData = await calculateBMI(person);
            //console.log("bmi data for single person", bmiData)
            bmiResults.push({ person: person, bmiData: bmiData });
        }

        const finalRecord = bmiResults.map(({
            person: {name, age, height, current_weight, gender},
            bmiData: {data: {
                bmi, health, healthy_bmi_range
            }}
        }) => ({name, age, height, current_weight, gender, bmi, health, healthy_bmi_range}))

        // Store BMI results back to MongoDB
        const bmiResultsCollection = peopleInfoDatabase.collection('bmiResults');
        await bmiResultsCollection.insertMany(bmiResults);

        resp.json({ message: 'BMI calculation completed and results stored in MongoDB', finalRecord});
    }
    catch (error){
        logger.error("Error encountered while calculating and storing BMI", error)
        resp.status(500).json({error: "Internal server error"})
    }
})

//GET Request to fetch only those records who are above 35 years of age
// https://localhost:8080/https-web-service/v1/bmi-data/age-above-35
access_bmi_data.get('/bmi-data/age-above-35', async (req, res) => {
    try {
        const peopleInfoDatabase = getPeopleInfo2024Database();
        const bmiResultsCollection = await peopleInfoDatabase.collection('bmiResults');
        const bmiRecords = await bmiResultsCollection.find().toArray();

        // Filter the data based on age above 35
        const ageAbove35Data = bmiRecords.filter(d => d.person.age > 35);

        // Check if any records are found
        if (ageAbove35Data.length > 0) {
            res.json({ ageAbove35Data });
        } else {
            res.status(404).json({ error: "No record found with age above 35" });
        }
    } catch (error) {
        console.error("Error fetching BMI data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

//GET Request to fetch only those records who are under 25 years of age
// https://localhost:8080/https-web-service/v1/bmi-data/age-under-25
access_bmi_data.get('/bmi-data/age-under-25', async (req, res) => {
    try {
        const peopleInfoDatabase = getPeopleInfo2024Database();
        const bmiResultsCollection = await peopleInfoDatabase.collection('bmiResults')
        const bmiRecords = await bmiResultsCollection.find().toArray();

        // Filter the data based on age under 25
        const ageUnder25Data = bmiRecords.filter(d => d.person.age < 25).map(({
            person: {name, age, height, current_weight},
            bmiData: {
                data: {bmi, health}
            }
        }) => ({name, age, height, current_weight, bmi, health}))

        // Check if any records are found
        if (ageUnder25Data.length > 0) {
            res.json({ ageUnder25Data })
        } else {
            res.status(404).json({ error: "No record found with age under 25" })
        }
    } catch (error) {
        console.error("Error fetching BMI data:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

//GET Request to fetch data of people who are Overweight
// https://localhost:8080/https-web-service/v1/bmi-data/health-status/overweight
access_bmi_data.get('/bmi-data/health-status/overweight', async (req, res) => {
    try {
        const peopleInfoDatabase = getPeopleInfo2024Database();
        const bmiResultsCollection = await peopleInfoDatabase.collection('bmiResults');
        const bmiRecords = await bmiResultsCollection.find().toArray();
        
        const overweightData = bmiRecords.filter(record => record.bmiData.data.health === "Overweight").map(({
            person: {name, age, current_weight}
        }) => ({name, age, current_weight}))

        if (overweightData.length > 0) {
            res.json({ overweightData });
        } else {
            res.status(404).json({ error: "No records found for people categorized as 'Overweight'" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error("Error:", error);
    }
})

//GET Request to fetch data of people who are not normal in health
// https://localhost:8080/https-web-service/v1/bmi-data/health-status/not-normal
access_bmi_data.get('/bmi-data/health-status/not-normal', async (req, res) => {
    try {
        const peopleInfoDatabase = getPeopleInfo2024Database()
        const bmiResultsCollection = await peopleInfoDatabase.collection('bmiResults')
        const bmiRecords = await bmiResultsCollection.find().toArray()
        
        const healthStatusNotNormal = bmiRecords.filter(record => record.bmiData.data.health !== "Normal").map(({
            person: {name},
            bmiData: {data: {health}}
        }) => ({name, health}))

        if (healthStatusNotNormal.length > 0) {
            res.json({ healthStatusNotNormal })
        } else {
            res.status(404).json({ error: "No records found" })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
        console.error("Error:", error);
    }
})

export default access_bmi_data