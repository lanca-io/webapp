import type { TokensState, TokensStore } from './types'
import type { PropsWithChildren } from 'react'
import { useContext, useRef } from 'react'
import { TokensStoreContext } from './TokensContext'
import { CreateTokensStore } from './CreateTokenStore'

export function TokensStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<TokensStore>()
	if (!storeRef.current) {
		storeRef.current = CreateTokensStore()
	}
	return <TokensStoreContext.Provider value={storeRef.current}>{children}</TokensStoreContext.Provider>
}

export function useTokensStore<T>(selector: (state: TokensState) => T, equalityFn?: (left: T, right: T) => boolean): T {
	const useStore = useContext(TokensStoreContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${TokensStoreProvider.name}>.`)
	}
	return useStore(selector, equalityFn)
}

export function useTokensStoreContext() {
	const useStore = useContext(TokensStoreContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${TokensStoreProvider.name}>.`)
	}
	return useStore
}
