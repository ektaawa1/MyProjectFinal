import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ProcessUserInput = () => {
    // State variables to store user input and BMI data
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmiData, setBmiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    //function to handle input from the user
    const handleUserInput = async(e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // call localhost API to calculate BMI
            const bmiAPIResponse = await axios.get('https://localhost:8080/https-web-service/v1/fetch-api-data', {
                params: {
                    age: age,
                    weight: weight,
                    height: height
                }
            })
            
            setBmiData(bmiAPIResponse.data)
        }
        catch (error) {
            // Handle errors
            console.error('Error calculating BMI:', error)
            setError('Error calculating BMI. Please try again.')
        }
        finally {
            setLoading(false);
        }
    }

    useEffect( () => {
        console.log("Hello from User Input Processing useEffect Hooks..")
    }, [])

    return (
        <div>
            <h2>BMI Calculator</h2>
            <form onSubmit={handleUserInput}>
                <div>
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="weight">Weight (kg):</label>
                    <input
                        type="number"
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="height">Height (cm):</label>
                    <input
                        type="number"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Calculating...' : 'Calculate BMI'}
                </button>
            </form>

            {bmiData && (
                <div>
                    <h3>BMI Result</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>BMI</th>
                                <th>Health</th>
                                <th>Healthy BMI Range</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{bmiData.data.bmi}</td>
                                <td>{bmiData.data.health}</td>
                                <td>{bmiData.data.healthy_bmi_range}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {error && <p>{error}</p>}
        </div>
    )
}