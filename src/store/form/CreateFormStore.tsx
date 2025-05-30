import type { FormState } from './types'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../tokens/types'
import { Mode, AddressMode, SlippageMode } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

const initFromToken: ExtendedToken = {
	chain_id: '10',
	name: 'USD Coin',
	symbol: 'USDC',
	address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
	logoURI:
		'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
	decimals: 6,
	coinGeckoId: null,
	is_popular: true,
	priceUsd: 1,
}

const initToToken: ExtendedToken = {
	chain_id: '137',
	name: 'USD Coin',
	symbol: 'USDC',
	address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
	logoURI: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
	decimals: 6,
	coinGeckoId: null,
	is_popular: true,
	priceUsd: 1,
}

const initFromChain: ILancaChain = {
	id: '10',
	name: 'Optimism',
	logoURI: 'https://api.concero.io/static/icons/chains/10.svg',
	explorerURI: 'https://optimistic.etherscan.io',
}

const initToChain: ILancaChain = {
	id: '137',
	name: 'Polygon',
	logoURI: 'https://api.concero.io/static/icons/chains/filled/137.svg',
	explorerURI: 'https://polygonscan.com',
}

export const CreateFormStore = () =>
	createWithEqualityFn<FormState>(
		set => ({
			fromChain: initFromChain,
			toChain: initToChain,
			fromToken: initFromToken,
			toToken: initToToken,
			fromAmount: null,
			toAddress: null,
			amountInput: '',
			amountInputError: null,
			amountInputMode: Mode.None,
			amountInputFocused: false,
			addressInput: '',
			addressInputError: null,
			addressInputMode: AddressMode.None,
			addressInputFocused: false,
			slippageInput: '',
			slippageInputError: null,
			slippageInputMode: SlippageMode.Auto,
			slippageInputFocused: false,
			setFromChain: chain => set({ fromChain: chain }),
			setToChain: chain => set({ toChain: chain }),
			setFromToken: token => set({ fromToken: token }),
			setToToken: token => set({ toToken: token }),
			setFromAmount: amount => set({ fromAmount: amount }),
			setToAddress: address => set({ toAddress: address }),
			setAmountInput: value => set({ amountInput: value }),
			setAmountInputError: error => set({ amountInputError: error }),
			setAmountInputMode: mode => set({ amountInputMode: mode }),
			setAmountInputFocused: focused => set({ amountInputFocused: focused }),
			setAddressInput: value => set({ addressInput: value }),
			setAddressInputError: error => set({ addressInputError: error }),
			setAddressInputMode: mode => set({ addressInputMode: mode }),
			setAddressInputFocused: focused => set({ addressInputFocused: focused }),
			setSlippageInput: value => set({ slippageInput: value }),
			setSlippageInputError: error => set({ slippageInputError: error }),
			setSlippageMode: mode => set({ slippageInputMode: mode }),
			setSlippageInputFocused: focused => set({ slippageInputFocused: focused }),
			clearInputs: () =>
				set({
					fromAmount: null,
					toAddress: null,
					amountInput: '',
					amountInputError: null,
					amountInputMode: Mode.None,
					amountInputFocused: false,
					addressInput: '',
					addressInputError: null,
					addressInputMode: AddressMode.None,
					addressInputFocused: false,
				}),

			swap: () =>
				set(state => ({
					fromChain: state.toChain,
					toChain: state.fromChain,
					fromToken: state.toToken,
					toToken: state.fromToken,
				})),
		}),
		Object.is,
	)
