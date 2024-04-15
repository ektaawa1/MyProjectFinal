import React, { useEffect, useState } from 'react';
import axios from 'axios';


export const BmiCalci = () => {

    const [bmiData, setBMIData] = useState(null)
    const [bmiDataError, setBMIDataError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchFitnessCalculatorAPI = async(e) => {
        try{
            setIsLoading(true)
            // GET request to calculate and return BMI data for every person
            const bmiDataResponse = await axios.get('https://localhost:8080/https-web-service/v1/calculate-bmi')
            
            setBMIData(bmiDataResponse.data)
        }
        catch{
            setBMIDataError(true)
        }
        finally{
            setIsLoading(false)
        }
        
    }

    useEffect( () => {
        console.log("Hello from BMI Calculator useEffect Hooks..")
    }, [])


    console.log(bmiData, "This is the BMI data of the people")

    if(isLoading){
        return <div>Loading...</div>
    }

    if(bmiDataError){
        return <div>Error occurred...</div>
    }

    return(
        <>
        
        <span>
            BMI Calculation for each record: {bmiData?.data}
        </span>

        <button onClick={fetchFitnessCalculatorAPI}>Check</button> 
        </>
    )
}
