import type { ReactNode } from 'react'
import type { InputContextValue } from './types'
import { useContext, useReducer } from 'react'
import { InputWidgetReducer, initialState } from './Reducer'
import { InputWidgetContext } from './Context'

export const InputWidgetProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(InputWidgetReducer, initialState)

	return (
		<InputWidgetContext.Provider value={{ state, dispatch }}>
			{children}
		</InputWidgetContext.Provider>
	)
}

export const useInputWidgetContext = (): InputContextValue => {
	const context = useContext(InputWidgetContext)
	if (!context) {
		throw new Error('useInputContext must be used within InputProvider')
	}
	return context
}
