import express from 'express';
import {getPeopleInfo2024Database} from '../database/database.js'

const peopleInfo = express.Router()

//1st- To retrieve all the people-info
//POSTMAN https://localhost:8080/https-web-service/v1/people-info 
peopleInfo.get('/people-info', async (req, res) => {
    //fetching people data from MONGO DB
    const peopleInfoDatabase = getPeopleInfo2024Database()
    console.log("Here is the database info")
    console.log(peopleInfoDatabase)
    const peopleData = await peopleInfoDatabase.collection('people').find().toArray()
    console.log(peopleData)
    res.json({peopleData})
})

//2nd- To update the record in the database
//POSTMAN https://localhost:8080/https-web-service/v1/update-age
peopleInfo.put('/update-age', async (req, res) => {
    const {name, age} = req.body

    const peopleInfoDatabase = getPeopleInfo2024Database()
    const updatedPerson = await peopleInfoDatabase.collection('people').findOneAndUpdate(
        { name: name },
        { $set: { age: age } },
        { returnOriginal: false }
    )
    //Fetch the updated data from the DB
    const updatedRecord = await peopleInfoDatabase.collection('people').findOne({_id: updatedPerson._id})
    res.json({ updatedPerson: updatedRecord})
})

//3rd- To delete a record in the database
//POSTMAN https://localhost:8080/https-web-service/v1/delete-person
peopleInfo.delete('/delete-person', async (req, res) => {
    const {name} = req.body
    
    const peopleInfoDatabase = getPeopleInfo2024Database()
    
    const deletedPerson = await peopleInfoDatabase.collection('people').findOneAndDelete(
        { name: name }
    )
    
    res.json({ deletedPerson })
})

//4th- To insert a new record in the database
//POSTMAN https://localhost:8080/https-web-service/v1/add-person
peopleInfo.post('/add-person', async (req, res) => {
    const { name, age, height, current_weight, gender } = req.body
    
    const peopleInfoDatabase = getPeopleInfo2024Database()
    
    // Create a new document object with the input data
    const newPerson = {
        name: name,
        age: age,
        height: height,
        current_weight: current_weight,
        gender: gender
    }
    
    // Insert the new person record into the 'people' collection
    const insertedPerson = await peopleInfoDatabase.collection('people').insertOne(newPerson)
    
    res.json({ insertedPerson })
})

export default peopleInfo