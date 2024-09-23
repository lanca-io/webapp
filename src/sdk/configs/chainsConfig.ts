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
	[base.id]: {
		chain: base,
		transport: fallback([
			http('https://base-rpc.publicnode.com'),
			http('https://base.drpc.org'),
			http('https://1rpc.io/base'),
		]),
	},
	[arbitrum.id]: {
		chain: arbitrum,
		transport: fallback([
			http(),
			http('https://1rpc.io/arb'),
			http('https://endpoints.omniatech.io/v1/arbitrum/one/public'),
			http('https://arbitrum.meowrpc.com'),
		]),
	},
	[polygon.id]: {
		chain: polygon,
		transport: fallback([
			http(),
			http('https://polygon.meowrpc.com'),
			http('https://polygon-pokt.nodies.app'),
			http('https://polygon-bor-rpc.publicnode.com'),
		]),
	},
	[avalanche.id]: {
		chain: avalanche,
		transport: fallback([
			http(),
			http('https://avalanche-c-chain-rpc.publicnode.com'),
			http('https://avalanche.drpc.org'),
			http('https://1rpc.io/avax/c'),
		]),
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
