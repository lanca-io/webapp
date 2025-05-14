import type { ExtendedToken } from '../tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'
import type { Address } from 'viem'

export enum Mode {
	None = 'none',
	Number = 'number',
	Percent = 'percent',
	Dollar = 'dollar',
	Text = 'text',
}

export enum AddressMode {
	None = 'none',
	Address = 'address',
	ENS = 'ens',
}

export type FormStateSlice = {
	fromChain: ILancaChain | null
	toChain: ILancaChain | null
	fromToken: ExtendedToken | null
	toToken: ExtendedToken | null
	fromAmount: string | null
	toAddress: Address | null

	amountInput: string
	amountInputError: string | null
	amountInputMode: Mode
	amountInputFocused: boolean

	addressInput: string
	addressInputError: string | null
	addressInputMode: AddressMode
	addressInputFocused: boolean
}

export type FormActions = {
	setFromChain: (chain: ILancaChain) => void
	setToChain: (chain: ILancaChain) => void
	setFromToken: (token: ExtendedToken) => void
	setToToken: (token: ExtendedToken) => void
	setFromAmount: (amount: string | null) => void
	setToAddress: (address: Address | null) => void
	setAmountInput: (value: string) => void
	setAmountInputError: (error: string | null) => void
	setAmountInputMode: (mode: Mode) => void
	setAmountInputFocused: (focused: boolean) => void
	setAddressInput: (value: string) => void
	setAddressInputError: (error: string | null) => void
	setAddressInputMode: (mode: AddressMode) => void
	setAddressInputFocused: (focused: boolean) => void
	clearInputs: () => void
	swap: () => void
}

export type FormState = FormStateSlice & FormActions
export type FormStore = UseBoundStoreWithEqualityFn<StoreApi<FormState>>
