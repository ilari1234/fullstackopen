import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filter, handleFilterChange}) => {
  return(
    <>
    filter shown with: <input value={filter} onChange={handleFilterChange} />
    </>
  )
}

const PersonForm = ( {submit, name, number, handleNameChange, handleNumberChange} ) => {
  return(
    <>
      <form onSubmit={submit}>
        <div>
          name: <input value={name} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={number} onChange={handleNumberChange} />
          </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )

}

const Persons = ( {persons} ) => persons.map(person => <p key={person.name}>{person.name} {person.number}</p>)
  
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personFilter, setPersonFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => setPersons(response.data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    persons.some(person => person.name.toLowerCase() === personObject.name.toLowerCase()) 
      ? alert(`${personObject.name} is already added to phonebook`) 
      : setPersons(persons.concat(personObject))

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setPersonFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(personFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={personFilter} handleFilterChange={handleFilterChange} />
      <h2>Add new</h2>
      <PersonForm submit={addPerson} name={newName} number={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons persons={personsToShow}/>
    </div>
  )

}

export default App
