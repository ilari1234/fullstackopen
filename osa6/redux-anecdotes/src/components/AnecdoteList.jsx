import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const dispatch = useDispatch()

  return (
    <div>
      {anecdotes
        .filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
          if (a.votes > b.votes) {
            return -1
          }
        })
        .map(anecdote =>
          <div key={anecdote.id}>
            <Anecdote anecdote={anecdote} handleClick={() => dispatch(voteAnecdote(anecdote.id))} />
          </div>
        )}
    </div>
  )
}

export default AnecdoteList