import type { AppKitNetwork } from '@reown/appkit/networks'
import { http, fallback } from 'wagmi'
import {
	arbitrum,
	arbitrumSepolia,
	base,
	baseSepolia,
	avalanche,
	avalancheFuji,
	polygon,
	polygonMumbai,
	optimism,
	optimismSepolia,
} from '@reown/appkit/networks'
import { config } from '../constants/config'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit/react'

export const projectId = config.WEB3_MODAL_PROJECT_ID

const metadata = {
	name: 'Lanca',
	description: 'Lanca',
	url: config.CONCERO_DOMAIN_URL,
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

const chains: [AppKitNetwork, ...AppKitNetwork[]] = [
	polygon,
	polygonMumbai,
	arbitrum,
	arbitrumSepolia,
	optimism,
	optimismSepolia,
	avalanche,
	avalancheFuji,
	base,
	baseSepolia,
]

export const wagmiAdapter = new WagmiAdapter({
	networks: chains,
	transports: {
		[polygon.id]: fallback([
			http('https://polygon.publicnode.com'),
			http('https://polygon.drpc.org'),
			http('https://rpc.ankr.com/polygon'),
			http('https://public.stackup.sh/api/v1/node/polygon-mainnet'),
			http(),
		]),
		[polygonMumbai.id]: http(),
		[arbitrum.id]: fallback([
			http('https://arbitrum-one.publicnode.com'),
			http('https://rpc.ankr.com/arbitrum'),
			http('https://arb1.arbitrum.io/rpc'),
			http('https://arbitrum.blockpi.network/v1/rpc/public'),
			http(),
		]),
		[arbitrumSepolia.id]: http('https://arbitrum-sepolia-rpc.publicnode.com'),
		[optimism.id]: fallback([
			http('https://1rpc.io/op'),
			http('https://optimism-rpc.publicnode.com'),
			http('https://optimism.drpc.org'),
			http('https://endpoints.omniatech.io/v1/op/mainnet/public'),
			http(),
		]),
		[optimismSepolia.id]: http(),
		[avalanche.id]: fallback([
			http('https://avalanche-c-chain-rpc.publicnode.com'),
			http('https://avalanche.drpc.org'),
			http('https://rpc.ankr.com/avalanche'),
			http('https://avalanche.public-rpc.com'),
			http(),
		]),
		[avalancheFuji.id]: http(),
		[base.id]: fallback([
			http('https://1rpc.io/base'),
			http('https://base-rpc.publicnode.com'),
			http('https://base.blockpi.network/v1/rpc/public'),
			http('https://public.stackup.sh/api/v1/node/base-mainnet'),
			http('https://base.drpc.org'),
			http(),
		]),
		[baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com'),
	},
	projectId,
})

createAppKit({
	adapters: [wagmiAdapter],
	networks: chains,
	metadata,
	projectId,
	features: {
		send: false,
		socials: false,
		analytics: true,
		email: false,
		onramp: false,
		swaps: false,
	},
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
