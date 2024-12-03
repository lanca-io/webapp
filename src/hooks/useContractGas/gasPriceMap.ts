import { arbitrum, avalanche, base, polygon } from 'wagmi/chains'

interface TxPrice {
	swap: number
	bridge: number
	swapAndBridge: number
}

export const gasUsedMap: Record<number, TxPrice> = {
	[base.id]: {
		swap: 181_000,
		bridge: 510_000,
		swapAndBridge: 631_000,
	},
	[polygon.id]: {
		swap: 195_000,
		bridge: 510_000,
		swapAndBridge: 590_000,
	},
	[arbitrum.id]: {
		swap: 410_000,
		bridge: 590_000,
		swapAndBridge: 800_000,
	},
	[avalanche.id]: {
		swap: 230_000,
		bridge: 490_000,
		swapAndBridge: 720_000,
	},
}
