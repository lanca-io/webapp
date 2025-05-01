import type { ExtendedToken } from '../tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export enum Mode {
	None = 'none',
	Number = 'number',
	Percent = 'percent',
	Dollar = 'dollar',
	Text = 'text',
}

export type FormStateSlice = {
	sourceChain: ILancaChain | null
	destinationChain: ILancaChain | null
	sourceToken: ExtendedToken | null
	destinationToken: ExtendedToken | null
	error: string | null
	inputValue: string
	inputMode: Mode
}

export type FormActions = {
	setSourceChain: (chain: ILancaChain) => void
	setDestinationChain: (chain: ILancaChain) => void
	setSourceToken: (token: ExtendedToken) => void
	setDestinationToken: (token: ExtendedToken) => void
	swapChainsAndTokens: () => void
	setError: (error: string | null) => void
	setInputValue: (value: string) => void
	setInputMode: (mode: Mode) => void
	clearInput: () => void
}

export type FormState = FormStateSlice & FormActions
export type FormStore = UseBoundStoreWithEqualityFn<StoreApi<FormState>>
