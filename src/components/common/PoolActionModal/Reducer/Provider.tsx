import type { ReactNode } from 'react'
import type { PoolsActionContextValue, PoolsActionType } from './types'
import { useContext, useReducer } from 'react'
import { PoolsActionContext } from './Context'
import { PoolsActionReducer, createInitialState } from './Reducer'

export const PoolsActionProvider: React.FC<{
	children: ReactNode
	initialType: PoolsActionType
}> = ({ children, initialType }) => {
	const [state, dispatch] = useReducer(
		PoolsActionReducer,
		initialType,
		createInitialState,
	)

	return (
		<PoolsActionContext.Provider value={{ state, dispatch }}>
			{children}
		</PoolsActionContext.Provider>
	)
}

export const usePoolsActionContext = (): PoolsActionContextValue => {
	const context = useContext(PoolsActionContext)
	if (!context) {
		throw new Error('useInputContext must be used within InputProvider')
	}
	return context
}
