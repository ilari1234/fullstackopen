const Header = ( {name} ) => <h2>{name}</h2>
  
const Part = ( {part} ) => <tr><td>{part.name} {part.exercises}</td></tr>

const Content = ( {parts} ) => {
  return (
    <table>
      <tbody>
        {parts.map((part) => <Part key={part.id} part={part}/>)}
      </tbody>
    </table>
  )
}

const Total = ( {parts} ) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
      <p style={{fontWeight:"bold"}}>total of {total} exercises</p>
  )
}

const Course = ( {course} ) => {

  return (
    <>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </>
  )
}

export default Course