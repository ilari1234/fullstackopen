import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote: (state, action) => {
      return state.map(anecdote => (anecdote.id === action.payload.id) ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote)
    },
    appendAnecdote: (state, action) => {
      return [...state, action.payload]
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

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

export default anecdoteSlice.reducer