import type { PropsWithChildren } from 'react'
import type { TokensState } from './types'
import type { TokensStore } from './TokensContext'
import { useContext, useRef } from 'react'
import { createWithEqualityFn } from 'zustand/traditional'
import { TokensStoreContext } from './TokensContext'

export function TokensStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<TokensStore>()
	if (!storeRef.current) {
		storeRef.current = createTokensStore()
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

export const createTokensStore = () =>
	createWithEqualityFn<TokensState>(
		set => ({
			tokens: [],
			isLoading: false,
			error: null,
			offset: 0,
			searchValue: '',
			setTokens: tokens => set({ tokens }),
			setLoading: isLoading => set({ isLoading }),
			setError: error => set({ error }),
			setOffset: offset => set({ offset }),
			setSearchValue: searchValue => set({ searchValue }),
			clearTokens: () => set({ tokens: [] }),
		}),
		Object.is,
	)
