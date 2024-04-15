import React, { useEffect, useState } from 'react';
import axios from 'axios';


export const HealthStatusCheck = () => {

    const [healthStatusData, setHealthStatusData] = useState(null)
    const [healthStatusError, setHealthStatusError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchHealthStatusAPI = async() => {

        try{
            setIsLoading(true)
            // GET request to fetch records whose health status is other than Normal.
            const healthStatusResponse = await axios.get('https://localhost:8080/https-web-service/v1/bmi-data/health-status/not-normal')
            
            setHealthStatusData(healthStatusResponse.data)
        }
        catch{
            setHealthStatusError(true)
        }
        finally{
            setIsLoading(false)
        }
        
    }

    useEffect( () => {
        console.log("Hello from Health Status Check useEffect Hooks")
    }, [])


    console.log(healthStatusData, "This is the BMI data of the people with status other than 'Normal'")

    if(isLoading){
        return <div>Loading...</div>
    }

    if(healthStatusError){
        return <div>Error occurred...</div>
    }

    return(
        <>
        
        <span>
            Health Status Records other than 'Normal': {healthStatusData?.data}
        </span>

        <button onClick={fetchHealthStatusAPI}>Check</button> 
        </>
    )
}
