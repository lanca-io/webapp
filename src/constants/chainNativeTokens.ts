import { arbitrum, avalanche, base, polygon } from 'wagmi/chains'

export const chainNativeTokensMap: Record<number, string> = {
	[polygon.id]: '0x0000000000000000000000000000000000000000',
	[arbitrum.id]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
	[avalanche.id]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
	[base.id]: '0x4200000000000000000000000000000000000006',
}
