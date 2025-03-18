import type { PropsWithChildren } from 'react'
import { useRef } from 'react'
import { SplitSubvariantStoreContext } from './SplitSubvariantContext'
import { CreateSplitSubvariantStore } from './CreateSubvariantStore'
import { SplitSubvariantProviderProps } from './types'
import { SplitSubvariantStore } from './types'

const shouldRecreateStore = (store: SplitSubvariantStore, props: SplitSubvariantProviderProps) => {
	const { state } = store.getState()
	return state !== props.state
}

export function SplitSubvariantStoreProvider({ children, ...props }: PropsWithChildren<SplitSubvariantProviderProps>) {
	const storeRef = useRef<SplitSubvariantStore>()
	if (!storeRef.current || shouldRecreateStore(storeRef.current, props)) {
		storeRef.current = CreateSplitSubvariantStore(props)
	}
	return (
		<SplitSubvariantStoreContext.Provider value={storeRef.current}>{children}</SplitSubvariantStoreContext.Provider>
	)
}
