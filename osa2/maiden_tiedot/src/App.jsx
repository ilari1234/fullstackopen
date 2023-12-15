import { useEffect, useState } from 'react'
import countryService from './services/countries'

const Filter = ({searchString, handleSearchChange}) => {
  return(
    <>
    find countries <input value={searchString} onChange={handleSearchChange}/>
    </>
  )
}

const Countries = ( { searchString, countries, showCountry} ) => {
  if (!searchString) {
    return null
  }

  if (!countries || countries.length === 0) {
    return <p>No countries match the filter</p>;
  }

  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countries.length <= 10 && countries.length > 1) {
    return(
      <table>
        <tbody>
          {countries.map(country => 
            <tr key={country.name.common}>
              <td>{country.name.common}</td>
              <td><button onClick={() => showCountry(country)}>show</button></td>
            </tr> )}
        </tbody>
      </table>
    )
  } else {
    return (
      <Country country={countries[0]}/>
    )
  }
}

const Country = ( {country} ) => {
  return(
    <>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages</h2>
      <ul>
        {Object.entries(country.languages).map(([short, long]) => (
          <li key={short}>{long}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="Flag"></img>
      <Weather capital={country.capital[0]}/>
    </>
  )
}

const Weather = ( {capital} ) => {
  const [weather, setWeather] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    countryService
    .getCapitalWeather(capital)
    .then(response => setWeather(response.current))
    .catch(error => setError(error))
    .finally(() => setLoading(false))
  },[])

  if (loading) {
    return(<p>Loading</p>)
  }

  if (error) {
    return <p>Error fetching weather data: {error}</p>;
  }

  if (!weather) {
    return <p>No weather data available</p>
  }

  return(
    <>
    <h2>Weather in {capital}</h2>
    <p>Temperature: {weather.temp_c} Celcius</p>
    <img src={weather.condition.icon} alt={weather.condition.text} />
    <p>Wind: {weather.wind_kph} km/h</p>
    </>
  )
}

function App() {
  const [searchString, setSearchString] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    countryService
    .getAll()
    .then(allCountries => setCountries(allCountries))
    .catch(error => console.log(error))
  },[])

  const showCountry = (country) => {
    setSearchString(country.name.common)
  }

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(searchString.toLowerCase()))

  const handleSearchChange = (event) => {
    setSearchString(event.target.value)
  }

  return (
    <>
      <Filter searchString={searchString} handleSearchChange={handleSearchChange}/>
      <Countries searchString={searchString} countries={countriesToShow} showCountry={showCountry} />
    </>
  )
}

export default App
