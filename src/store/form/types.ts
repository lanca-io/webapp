import type { ExtendedToken } from '../tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type FormStateSlice = {
	sourceChain: ILancaChain | null
	destinationChain: ILancaChain | null
	sourceToken: ExtendedToken | null
	destinationToken: ExtendedToken | null
	amount: string | null
	error: string | null
}

export type FormActions = {
	setSourceChain: (chain: ILancaChain) => void
	setDestinationChain: (chain: ILancaChain) => void
	setSourceToken: (token: ExtendedToken) => void
	setDestinationToken: (token: ExtendedToken) => void
	setAmount: (amount: string | null) => void
	clearAmount: () => void
	swapChainsAndTokens: () => void
	setError: (error: string | null) => void
}

export type FormState = FormStateSlice & FormActions
export type FormStore = UseBoundStoreWithEqualityFn<StoreApi<FormState>>
