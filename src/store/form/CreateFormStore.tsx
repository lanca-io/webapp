import type { FormState } from './types'
import type { ExtendedToken } from '../tokens/types'
import { Mode, AddressMode, SlippageMode } from './types'
import { createWithEqualityFn } from 'zustand/traditional'
import { ConceroChain } from '../chains/types'

const initFromToken: ExtendedToken = {
	chain_id: 10,
	name: 'USD Coin',
	symbol: 'USDC',
	address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
	logo_url:
		'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
	decimals: 6,
	price_usd: String(1),
}

const initToToken: ExtendedToken = {
	chain_id: 137,
	name: 'USD Coin',
	symbol: 'USDC',
	address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
	logo_url: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
	decimals: 6,
	price_usd: String(1),
}

const initFromChain: ConceroChain = {
	id: 10,
	name: 'Optimism',
	selector: 3734403246176062136n,
	logo: 'https://api.v2.concero.io/static/chains/10.svg',
	nativeCurrency: {
		name: 'ETH',
		symbol: 'ETH',
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: [
				'https://optimism-mainnet.public.blastapi.io',
				'https://optimism.drpc.org',
				'https://go.getblock.io/e8a75f8dcf614861becfbcb185be6eb4',
				'https://gateway.tenderly.co/public/optimism',
				'https://0xrpc.io/op',
				'https://opt-mainnet.g.alchemy.com/v2/demo',
				'https://mainnet.optimism.io',
				'https://optimism.gateway.tenderly.co',
				'https://optimism-rpc.publicnode.com',
				'https://optimism.api.onfinality.io/public',
				'https://1rpc.io/op',
				'https://optimism.therpc.io',
				'https://optimism.rpc.subquery.network/public',
				'https://optimism-public.nodies.app',
				'https://optimism.public.blockpi.network/v1/rpc/public',
				'https://public-op-mainnet.fastnode.io',
			],
		},
	},
	explorer: 'https://optimistic.etherscan.io',
	testnet: false,
	contracts: {
		bridge_v2: '0x084e84446FE08B27d1b7106ef4d29f813708d729',
	},
}

const initToChain: ConceroChain = {
	id: 137,
	name: 'Polygon',
	selector: 4051577828743386545n,
	logo: 'https://api.v2.concero.io/static/chains/137.svg',
	nativeCurrency: {
		name: 'POL',
		symbol: 'POL',
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: [
				'https://polygon-mainnet.public.blastapi.io',
				'https://rpc.poolz.finance/polygon',
				'https://go.getblock.io/02667b699f05444ab2c64f9bff28f027',
				'https://gateway.tenderly.co/public/polygon',
				'https://polygon.lava.build',
				'https://polygon.meowrpc.com',
				'https://polygon-public.nodies.app',
				'https://polygon-bor-rpc.publicnode.com',
				'https://polygon-mainnet.g.alchemy.com/v2/demo',
				'https://polygon.gateway.tenderly.co',
				'https://polygon.drpc.org',
				'https://polygon-rpc.com',
				'https://1rpc.io/matic',
				'https://polygon.api.onfinality.io/public',
				'https://polygon.rpc.subquery.network/public',
				'https://polygon.therpc.io',
				'https://rpc-mainnet.matic.quiknode.pro',
				'https://polygon-mainnet.rpcfast.com?api_key=xbhWBI1Wkguk8SNMu1bvvLurPGLXmgwYeC4S6g2H7WdwFigZSmPWVZRxrskEQwIf',
			],
		},
	},
	explorer: 'https://polygonscan.com',
	testnet: false,
	contracts: {
		bridge_v2: '0x0EF5038Ef129401a5Ff963A55BF37A6CF2f29C91',
	},
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
