import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote])
      dispatch({ type: 'SET_NOTIFICATION', payload: `new anecdote '${newAnecdote.content}' created` })
      setTimeout(() => { dispatch({ type: 'CLEAR_NOTIFICATION' }) }, 5000)
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: error.response.data.error })
      setTimeout(() => { dispatch({ type: 'CLEAR_NOTIFICATION' }) }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
