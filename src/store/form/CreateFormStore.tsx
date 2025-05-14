import type { FormState } from './types'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../tokens/types'
import { Mode } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

const initialSourceToken: ExtendedToken = {
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

const initialDestinationToken: ExtendedToken = {
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

const initialSourceChain: ILancaChain = {
	id: '10',
	name: 'Optimism',
	// @ts-ignore
	logoURL: 'https://api.concero.io/static/icons/chains/10.svg',
	explorerURI: 'https://optimistic.etherscan.io',
}

const initialDestinationChain: ILancaChain = {
	id: '137',
	name: 'Polygon',
	// @ts-ignore
	logoURL: 'https://api.concero.io/static/icons/chains/filled/137.svg',
	explorerURI: 'https://polygonscan.com',
}

export const CreateFormStore = () =>
	createWithEqualityFn<FormState>(
		set => ({
			sourceChain: initialSourceChain,
			destinationChain: initialDestinationChain,
			sourceToken: initialSourceToken,
			destinationToken: initialDestinationToken,
			error: null,
			inputValue: '',
			inputMode: Mode.None,
			amount: null,
			setSourceChain: chain => set({ sourceChain: chain }),
			setDestinationChain: chain => set({ destinationChain: chain }),
			setSourceToken: token => set({ sourceToken: token }),
			setDestinationToken: token => set({ destinationToken: token }),
			setError: error => set({ error }),
			swapChainsAndTokens: () =>
				set(state => ({
					sourceChain: state.destinationChain,
					destinationChain: state.sourceChain,
					sourceToken: state.destinationToken,
					destinationToken: state.sourceToken,
				})),
			setInputValue: value => set({ inputValue: value }),
			setInputMode: mode => set({ inputMode: mode }),
			setAmount: amount => set({ amount }),
			clearInput: () =>
				set({
					inputValue: '',
					inputMode: Mode.None,
					error: null,
					amount: null,
				}),
		}),
		Object.is,
	)
