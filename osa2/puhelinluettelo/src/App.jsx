import { useState, useEffect } from 'react'
import personService from './services/persons'

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

const Persons = ( {persons, deletePersonById} ) => {
  return (
    <table>
      <tbody>
        {persons.map(person => 
        <Person key={person.id} person={person} deletePerson={() => deletePersonById(person)}/>
        )}
      </tbody>
    </table>
    
  )
}

const Person = ( {person, deletePerson} ) => {
  return (
    <tr>      
      <td>{person.name}</td>
      <td>{person.number}</td>
      <td><button onClick={deletePerson}>delete</button></td>
    </tr>
  )
}
  
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [personFilter, setPersonFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    persons.some(person => person.name.toLowerCase() === personObject.name.toLowerCase()) 
      ? window.confirm(`${personObject.name} is already in phonebook, replace the old number with new one?`) 
        ? updatePerson(personObject) 
        : ""
      : personService
        .create(personObject)
          .then(createdPerson => setPersons(persons.concat(createdPerson)))
          .catch(error => alert(`Failed to create: ${personObject.name}`))

    setNewName('')
    setNewNumber('')
  }

  const deletePersonById = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personService.remove(personToDelete.id)
      .then(setPersons(remainingPersons => remainingPersons.filter(person => person.id !== personToDelete.id)))
      .catch(error => alert(`Failed to delete: ${personToDelete.name}`))
    }
  }

  const updatePerson = (updatedPerson) => {

    const originalPerson = persons.find(p => p.name === updatedPerson.name)
    const updatedPersonObject = {...originalPerson, number: updatedPerson.number}

    personService
      .update(originalPerson.id, updatedPersonObject)
      .then(response => {
        setPersons(persons.map(person => person.id !== originalPerson.id ? person : response))})
        .catch(error => alert(`Failed to update: ${updatedPerson.name}`))
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
      <Persons persons={personsToShow} deletePersonById={deletePersonById}/>
    </div>
  )

}

export default App
