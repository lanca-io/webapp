import type { ExtendedToken } from '../tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type FormState = {
	srcChain: ILancaChain | null
	dstChain: ILancaChain | null
	setSrcChain: (chain: ILancaChain) => void
	setDstChain: (chain: ILancaChain) => void

	srcToken: ExtendedToken | null
	dstToken: ExtendedToken | null
	setSrcToken: (token: ExtendedToken) => void
	setDstToken: (token: ExtendedToken) => void

	amount: string | null
	setAmount: (amount: string | null) => void
	clearAmount: () => void

	error: string | null
	setError: (error: string | null) => void

	swapChainsAndTokens: () => void
}

export type FormStore = UseBoundStoreWithEqualityFn<StoreApi<FormState>>
