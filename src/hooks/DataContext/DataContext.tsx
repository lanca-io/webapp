import { createContext, useEffect, useState } from 'react'
import { fetchTokens } from '../../api/concero/fetchTokens'
import { fetchChains } from '../../api/concero/fetchChains'
import { config } from '../../constants/config'
import { type DataContextValue, type DataProviderProps, type GetChainsParams } from './types'
import { type Chain } from '../../api/concero/types'

export const initialState = {
	tokens: {
		'8453': [
			{
				name: 'USD Coin',
				symbol: 'USDC',
				address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
				logoURI:
					'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
				decimals: 6,
				coinGeckoId: null,
				is_popular: true,
				priceUsd: 1,
			},
		],
		'137': [
			{
				name: 'USD Coin',
				symbol: 'USDC',
				address: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359',
				logoURI: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
				decimals: 6,
				coinGeckoId: null,
				is_popular: true,
				priceUsd: 1,
			},
		],
	},
	chains: [
		{
			id: '8453',
			name: 'BASE',
			symbol: 'ETH',
			addressPatterns: ['^(0x)[0-9A-Fa-f]{40}$'],
			logoURI: 'https://api.concero.io/static/icons/chains/8453.svg',
			explorerURI: 'https://basescan.org',
			providers: [
				{
					name: 'lifi',
					symbol: 'ETH',
				},
				{
					name: 'rango',
					symbol: 'ETH',
				},
			],
		},
		{
			id: '137',
			name: 'Polygon',
			symbol: 'MATIC',
			addressPatterns: ['^(0x)[0-9A-Fa-f]{40}$'],
			logoURI: `${config.CONCERO_ASSETS_URI}/icons/chains/filled/137.svg`,
			explorerURI: 'https://polygonscan.com',
			providers: [
				{
					name: 'lifi',
					symbol: 'MATIC',
				},
				{
					name: 'rango',
					symbol: 'POLYGON',
				},
			],
		},
	],
}

export const DataContext = createContext<DataContextValue>({
	getTokens: async () => [],
	getChains: async () => [],
	tokens: {},
	chains: [],
	setTokens: () => {},
	setChains: () => {},
	getChainByProviderSymbol: async () => null,
})

export function DataProvider({ children }: DataProviderProps) {
	const [tokens, setTokens] = useState(initialState.tokens)
	const [chains, setChains] = useState(initialState.chains)

	const getTokens = async ({ chainId, offset = 0, limit = 15, search }: GetChainsParams) => {
		if (search) {
			return await fetchTokens({ chainId, offset, limit, search })
		}

		if (tokens[chainId]?.length >= offset + limit) {
			return tokens[chainId].slice(offset, offset + limit)
		}
		// if (tokens[chainId]?.length < limit) {
		// 	return tokens[chainId]
		// }

		const response = await fetchTokens({ chainId, offset, limit, search })

		setTokens(prevTokens => {
			const existingTokens = prevTokens[chainId] || []
			return { ...prevTokens, [chainId]: [...existingTokens, ...response] }
		})
		return response
	}

	const getChains = async ({ chainId, offset, limit, search }: GetChainsParams): Promise<Chain[]> => {
		if (search) {
			return await fetchChains({ search })
		}
		if (chains.length >= offset + limit) {
			return chains.slice(offset, offset + limit)
		}

		const response = await fetchChains({ chainId, offset, limit })
		setChains(prevChains => [...prevChains, ...response])
		return response
	}

	async function getChainByProviderSymbol(providerSymbol: string): Promise<Chain | null> {
		const chains = await getChains({})
		const index = chains.findIndex((chain: Chain) =>
			chain.providers.some(provider => provider.symbol === providerSymbol),
		)
		return index !== -1 ? chains[index] : null
	}

	const initialFetch = async () => {
		const [ethTokens, polygonTokens, fetchedChains] = await Promise.all([
			fetchTokens({ chainId: '8453', offset: 0, limit: 15 }),
			fetchTokens({ chainId: '137', offset: 0, limit: 15 }),
			fetchChains({ offset: 0, limit: 20 }),
		])

		setTokens({ '8453': ethTokens, '137': polygonTokens })
		setChains(fetchedChains)
	}

	useEffect(() => {
		void initialFetch()
	}, [])

	return (
		<DataContext.Provider
			value={{ getTokens, getChains, tokens, chains, setTokens, setChains, getChainByProviderSymbol }}
		>
			{children}
		</DataContext.Provider>
	)
}
