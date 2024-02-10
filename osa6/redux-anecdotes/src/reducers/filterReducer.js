const initialState = ''

const filterReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'SET_FILTER':
			return action.payload.filter
		default:
			return state
	}
}

export const filterAnecdotes = (filter) => {
	return {
		type: 'SET_FILTER',
		payload: { filter }
	}
}

export default filterReducer