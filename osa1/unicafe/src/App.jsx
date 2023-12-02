import { useState } from 'react'

const Button = ( {handleClick, text} ) => {
  
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const StatisticsLine = (props) => {
    
  return (
    <tr>
      <td>{props.text}</td><td>{props.value}</td>
    </tr>
    )
  }

const Statistics = ( props ) => {
  let total = props.values.good + props.values.neutral + props.values.bad
  let avg = (props.values.good + (props.values.bad * -1)) / total
  let positive = (props.values.good/total) * 100 + " %"

  if (total === 0) {
    return (
      <p>No feedbacks given</p>
    )
  }

  return (
    <table>
      <tbody>
      <StatisticsLine text="good" value={props.values.good}/>
      <StatisticsLine text="neutral" value={props.values.neutral}/>
      <StatisticsLine text="bad" value={props.values.bad}/>
      <StatisticsLine text="average" value={avg}/>
      <StatisticsLine text="positive" value={positive}/>
      </tbody>
    </table>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const values = {
    "good" : good,
    "neutral" : neutral,
    "bad" : bad
  }

  const handleGood = () => {
    setGood(good + 1)
  }

  const handleNeutral = () => {
    setNeutral(neutral + 1)
  }

  const handleBad = () => {
    setBad(bad + 1)
  }

  //<Statistics good={good} neutral={neutral} bad={bad}/>

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGood} text="good"/>
      <Button handleClick={handleNeutral} text="neutral"/>
      <Button handleClick={handleBad} text="bad"/>
      <h1>statistics</h1>
      <Statistics values={values}/>
    </div>
  )
}

export default App