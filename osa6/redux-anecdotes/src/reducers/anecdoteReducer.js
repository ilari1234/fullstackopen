import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    appendAnecdote: (state, action) => {
      return [...state, action.payload]
    },
    setAnecdotes: (state, action) => {
      return action.payload
    },
    updateAnecdote: (state, action) => {
      return state.map(anecdote => (anecdote.id === action.payload.id) ? action.payload : anecdote)
    }
  }
})

export const { appendAnecdote, setAnecdotes, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.updateAnecdote({ ...anecdote, votes: anecdote.votes + 1 })
    dispatch(updateAnecdote(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer