import { createSlice } from '@reduxjs/toolkit'


const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote: (state, action) => {
      return state.map(anecdote => (anecdote.id === action.payload.id) ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote)
    },
    createAnecdote: (state, action) => {
      return [...state, action.payload]
    },
    setAnecdotes: (state, action) => {
      return action.payload
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer