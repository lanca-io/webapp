import type { AppKitNetwork } from '@reown/appkit/networks'
import { createPublicClient } from 'viem'
import { http, fallback } from 'viem'
import { optimism, polygon, arbitrum, avalanche, base } from '@reown/appkit/networks'

export const chains: [AppKitNetwork, ...AppKitNetwork[]] = [optimism, polygon, arbitrum, avalanche, base]

export const transports = {
	[polygon.id]: fallback([
		http('https://polygon.publicnode.com'),
		http('https://polygon.drpc.org'),
		http('https://rpc.ankr.com/polygon'),
		http('https://public.stackup.sh/api/v1/node/polygon-mainnet'),
		http(),
	]),

	[arbitrum.id]: fallback([
		http('https://arbitrum-one.publicnode.com'),
		http('https://rpc.ankr.com/arbitrum'),
		http('https://arb1.arbitrum.io/rpc'),
		http('https://arbitrum.blockpi.network/v1/rpc/public'),
		http(),
	]),

	[optimism.id]: fallback([
		http('https://1rpc.io/op'),
		http('https://optimism-rpc.publicnode.com'),
		http('https://optimism.drpc.org'),
		http('https://endpoints.omniatech.io/v1/op/mainnet/public'),
		http(),
	]),

	[avalanche.id]: fallback([
		http('https://avalanche-c-chain-rpc.publicnode.com'),
		http('https://avalanche.drpc.org'),
		http('https://rpc.ankr.com/avalanche'),
		http('https://avalanche.public-rpc.com'),
		http(),
	]),

	[base.id]: fallback([
		http('https://1rpc.io/base'),
		http('https://base-rpc.publicnode.com'),
		http('https://base.blockpi.network/v1/rpc/public'),
		http('https://base.drpc.org'),
		http(),
	]),
}

export const viemChains: Record<number, { chain: any; transport: any }> = {
	[polygon.id]: {
		chain: polygon,
		transport: fallback([
			http('https://polygon.publicnode.com'),
			http('https://polygon.drpc.org'),
			http('https://rpc.ankr.com/polygon'),
			http('https://public.stackup.sh/api/v1/node/polygon-mainnet'),
			http(),
		]),
	},
	[arbitrum.id]: {
		chain: arbitrum,
		transport: fallback([
			http('https://arbitrum-one.publicnode.com'),
			http('https://rpc.ankr.com/arbitrum'),
			http('https://arb1.arbitrum.io/rpc'),
			http('https://arbitrum.blockpi.network/v1/rpc/public'),
			http(),
		]),
	},
	[optimism.id]: {
		chain: optimism,
		transport: fallback([
			http('https://1rpc.io/op'),
			http('https://optimism-rpc.publicnode.com'),
			http('https://optimism.drpc.org'),
			http('https://endpoints.omniatech.io/v1/op/mainnet/public'),
			http(),
		]),
	},
	[avalanche.id]: {
		chain: avalanche,
		transport: fallback([
			http('https://avalanche-c-chain-rpc.publicnode.com'),
			http('https://avalanche.drpc.org'),
			http('https://rpc.ankr.com/avalanche'),
			http('https://avalanche.public-rpc.com'),
			http(),
		]),
	},
	[base.id]: {
		chain: base,
		transport: fallback([
			http('https://base-pokt.nodies.app'),
			http('https://base-rpc.publicnode.com'),
			http('https://base.blockpi.network/v1/rpc/public'),
			http('https://public.stackup.sh/api/v1/node/base-mainnet'),
			http(),
		]),
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
