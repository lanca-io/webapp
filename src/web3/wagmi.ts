import { createConfig, http } from 'wagmi'
import { createPublicClient, fallback } from 'viem'
import {
	arbitrum,
	arbitrumSepolia,
	aurora,
	avalanche,
	base,
	baseSepolia,
	boba,
	bsc,
	cronos,
	evmos,
	fantom,
	fuse,
	gnosis,
	linea,
	mainnet,
	moonbeam,
	moonriver,
	okc,
	optimism,
	optimismSepolia,
	polygon,
	polygonZkEvm,
	sepolia,
	zkSync,
} from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { config as appConfig } from '../constants/config'

export const projectId = appConfig.WEB3_MODAL_PROJECT_ID
export const chains = [
	mainnet,
	polygon,
	polygonZkEvm,
	arbitrum,
	aurora,
	zkSync,
	moonriver,
	moonbeam,
	boba,
	optimism,
	fuse,
	bsc,
	avalanche,
	gnosis,
	base,
	fantom,
	okc,
	cronos,
	linea,
	evmos,
	sepolia,
	baseSepolia,
	arbitrumSepolia,
	optimismSepolia,
]

const metadata = {
	name: 'Concero',
	description: 'Concero',
	url: appConfig.CONCERO_DOMAIN_URL,
	icons: ['https://avatars.githubusercontent.com/u/37784886'],
}

export const config = createConfig({
	chains: [
		mainnet,
		polygon,
		sepolia,
		polygonZkEvm,
		arbitrum,
		aurora,
		zkSync,
		moonriver,
		moonbeam,
		boba,
		optimism,
		fuse,
		bsc,
		avalanche,
		gnosis,
		base,
		fantom,
		okc,
		cronos,
		linea,
		evmos,
		baseSepolia,
		arbitrumSepolia,
		optimismSepolia,
	],
	transports: {
		[mainnet.id]: http(),
		[polygon.id]: fallback([http('https://polygon-bor-rpc.publicnode.com'), http('https://polygon.meowrpc.com')]),
		[polygonZkEvm.id]: http(),
		[arbitrum.id]: fallback([
			http('https://arbitrum.llamarpc.com'),
			http('https://arbitrum-one-rpc.publicnode.com'),
		]),
		[aurora.id]: http(),
		[zkSync.id]: http(),
		[moonriver.id]: http(),
		[moonbeam.id]: http(),
		[boba.id]: http(),
		[optimism.id]: http(),
		[fuse.id]: http(),
		[bsc.id]: http(),
		[avalanche.id]: fallback([
			http('https://avalanche.drpc.org'),
			http('https://avalanche-c-chain-rpc.publicnode.com'),
		]),
		[gnosis.id]: http(),
		[base.id]: fallback([http('https://base-rpc.publicnode.com'), http('https://base.meowrpc.com')]),
		[fantom.id]: http(),
		[okc.id]: http(),
		[cronos.id]: http(),
		[linea.id]: http(),
		[evmos.id]: http(),
		[sepolia.id]: http(),
		[baseSepolia.id]: http('https://base-sepolia-rpc.publicnode.com'),
		[arbitrumSepolia.id]: http('https://arbitrum-sepolia-rpc.publicnode.com'),
		[optimismSepolia.id]: http(),
	},
	connectors: [
		walletConnect({ projectId, metadata, showQrModal: false }),
		injected({ shimDisconnect: true }),
		coinbaseWallet({
			appName: metadata.name,
			appLogoUrl: metadata.icons[0],
		}),
	],
})

createWeb3Modal({
	wagmiConfig: config,
	projectId,
	enableAnalytics: true,
})

export const configChainsViem = {
	[mainnet.id]: mainnet,
	[polygon.id]: polygon,
	[arbitrum.id]: arbitrum,
	[avalanche.id]: avalanche,
	[base.id]: base,
}

const viemChains: Record<number, { chain: any; transport: any }> = {
	[mainnet.id]: { chain: mainnet, transport: http() },
	[polygon.id]: {
		chain: polygon,
		transport: fallback([http('https://polygon-bor-rpc.publicnode.com'), http('https://polygon.meowrpc.com')]),
	},
	[arbitrum.id]: {
		chain: arbitrum,
		transport: fallback([http('https://arbitrum.llamarpc.com'), http('https://arbitrum-one-rpc.publicnode.com')]),
	},
	[avalanche.id]: {
		chain: avalanche,
		transport: fallback([http('https://avalanche.drpc.org'), http('https://avalanche-c-chain-rpc.publicnode.com')]),
	},
	[base.id]: {
		chain: base,
		transport: fallback([http('https://base-rpc.publicnode.com'), http('https://base.meowrpc.com')]),
	},
}

export const getPublicClient = (chainId: number) => {
	const chainConfig = viemChains[chainId]
	if (!chainConfig) {
		throw new Error(`Unsupported chain ID: ${chainId}`)
	}
	return createPublicClient({
		chain: chainConfig.chain,
		transport: chainConfig.transport,
	})
}
