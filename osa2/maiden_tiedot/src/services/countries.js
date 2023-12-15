import axios from "axios";
const apiKey = import.meta.env.VITE_SOME_KEY
const countryUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}`

const getAll = () => {
    const request = axios.get(`${countryUrl}/all`)
    return request.then(response => response.data)
}

const getByName = country => {
    const request = axios.get(`${countryUrl}/name/${country}`)
    return request.then(response => response.data)
}

const getCapitalWeather = (capital) => {
    const request = axios.get(`${weatherUrl}&q=${capital}`)
    return request.then(response => response.data)
}

export default {
    getAll, getByName, getCapitalWeather
}