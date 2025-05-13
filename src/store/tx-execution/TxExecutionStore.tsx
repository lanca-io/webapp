import type { PropsWithChildren } from 'react'
import type { TxExecutionStore } from './types'
import { useEffect, useRef } from 'react'
import { CreateTxExecutionStore } from './CreateTxExecutionStore'
import { TxExecutionContext } from './TxExecutionContext'
import { useRouteStore } from '../route/useRouteStore'

export function TxExecutionStoreProvider({ children }: PropsWithChildren<{}>) {
	const { route } = useRouteStore()
	const storeRef = useRef<TxExecutionStore | null>(null)

	if (!storeRef.current) {
		storeRef.current = CreateTxExecutionStore()
	}

	useEffect(() => {
		if (storeRef.current) {
			storeRef.current.getState().deriveStepsFromRoute(route)
		}
	}, [route])

	return <TxExecutionContext.Provider value={storeRef.current}>{children}</TxExecutionContext.Provider>
}
