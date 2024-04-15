import React, { useEffect, useState } from 'react';
import axios from 'axios';


export const UnderAge25Record = () => {

    const [ageUnder25Data, setAgeUnder25Data] = useState(null)
    const [ageUnder25Error, setAgeUnder25Error] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const fetchDataUnder25API = async() => {

        try{
            setIsLoading(true)
            // GET request to return records under the age 25
            const ageUnder25Response = await axios.get('https://localhost:8080/https-web-service/v1/bmi-data/age-under-25')
            
            setAgeUnder25Data(ageUnder25Response.data)
        }
        catch{
            setAgeUnder25Error(true)
        }
        finally{
            setIsLoading(false)
        }
        
    }

    useEffect( () => {
        console.log("Hello from Under Age 25 Records useEffect Hooks")

        //fetchDataUnder25API()
    }, [])


    console.log(ageUnder25Data, "This is the data of the people under age 25")

    if(isLoading){
        return <div>Loading...</div>
    }

    if(ageUnder25Error){
        return <div>Error occurred...</div>
    }

    return(
        <>
        
        <span>
            Health Record Under age 25: {ageUnder25Data?.data}
        </span>

        <button onClick={fetchDataUnder25API}>Check</button> 
        </>
    )
}
