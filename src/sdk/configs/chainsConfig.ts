import { type Chain, fallback, type Transport } from 'viem'
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
} from 'viem/chains'
import { http } from 'wagmi'

export const viemChains: Record<string, { chain: Chain; transport?: Transport }> = {
	[mainnet.id]: {
		chain: mainnet,
	},
	[polygon.id]: {
		chain: polygon,
		transport: fallback([http('https://polygon-bor-rpc.publicnode.com'), http('https://polygon.meowrpc.com')]),
	},
	[arbitrum.id]: {
		chain: arbitrum,
		transport: fallback([http('https://arb1.arbitrum.io/rpc'), http('https://arbitrum-one-rpc.publicnode.com')]),
	},
	[avalanche.id]: {
		chain: avalanche,
		transport: fallback([http('https://avalanche.drpc.org'), http('https://avalanche-c-chain-rpc.publicnode.com')]),
	},
	[base.id]: {
		chain: base,
		transport: fallback([http('https://base-rpc.publicnode.com'), http('https://base.meowrpc.com')]),
	},
	[sepolia.id]: {
		chain: sepolia,
	},
	[polygonZkEvm.id]: {
		chain: polygonZkEvm,
	},
	[aurora.id]: {
		chain: aurora,
	},
	[zkSync.id]: {
		chain: zkSync,
	},
	[moonriver.id]: {
		chain: moonriver,
	},
	[moonbeam.id]: {
		chain: moonbeam,
	},
	[boba.id]: {
		chain: boba,
	},
	[optimism.id]: {
		chain: optimism,
	},
	[fuse.id]: {
		chain: fuse,
	},
	[bsc.id]: {
		chain: bsc,
	},
	[gnosis.id]: {
		chain: gnosis,
	},
	[fantom.id]: {
		chain: fantom,
	},
	[okc.id]: {
		chain: okc,
	},
	[cronos.id]: {
		chain: cronos,
	},
	[linea.id]: {
		chain: linea,
	},
	[evmos.id]: {
		chain: evmos,
	},
	[baseSepolia.id]: {
		chain: baseSepolia,
		transport: http('https://base-sepolia-rpc.publicnode.com'),
	},
	[arbitrumSepolia.id]: {
		chain: arbitrumSepolia,
		transport: http('https://arbitrum-sepolia-rpc.publicnode.com'),
	},
	[optimismSepolia.id]: {
		chain: optimismSepolia,
	},
}
