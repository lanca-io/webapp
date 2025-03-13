import type { TokensStore } from './types'
import type { PropsWithChildren } from 'react'
import { useContext, useRef } from 'react'
import { TokensContext } from './TokensContext'
import { CreateTokensStore } from './CreateTokenStore'

export function TokensStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<TokensStore>()
	if (!storeRef.current) {
		storeRef.current = CreateTokensStore()
	}
	return <TokensContext.Provider value={storeRef.current}>{children}</TokensContext.Provider>
}

export function useTokensStoreContext() {
	const useStore = useContext(TokensContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${TokensStoreProvider.name}>.`)
	}
	return useStore
}
