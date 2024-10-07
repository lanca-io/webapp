import { arbitrum, avalanche, base, polygon } from 'wagmi/chains'

export const chainIdToNameMap: Record<number, string> = {
	[base.id]: base.name,
	[arbitrum.id]: arbitrum.name,
	[polygon.id]: polygon.name,
	[avalanche.id]: avalanche.name,
}
