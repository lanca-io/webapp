import type { Address } from 'viem'
import { conceroProxyMap } from '@lanca/sdk'

export const contractAddresses: Record<string, Address> = {
	'10': conceroProxyMap.CONCERO_PROXY_OPTIMISM,
	'137': conceroProxyMap.CONCERO_PROXY_POLYGON,
	'42161': conceroProxyMap.CONCERO_PROXY_ARBITRUM,
	'8453': conceroProxyMap.CONCERO_PROXY_BASE,
	'43114': conceroProxyMap.CONCERO_PROXY_AVALANCHE,
}

export const poolAddresses: Record<string, Address> = {
	'10': conceroProxyMap.CONCERO_POOL_OPTIMISM,
	'137': conceroProxyMap.CONCERO_POOL_POLYGON,
	'42161': conceroProxyMap.CONCERO_POOL_ARBITRUM,
	'8453': conceroProxyMap.CONCERO_POOL_BASE,
	'43114': conceroProxyMap.CONCERO_POOL_AVALANCHE,
}

export const usdcAddresses: Record<string, Address> = {
	'10': conceroProxyMap.USDC_OPTIMISM,
	'137': conceroProxyMap.USDC_POLYGON,
	'42161': conceroProxyMap.USDC_ARBITRUM,
	'8453': conceroProxyMap.USDC_BASE,
	'43114': conceroProxyMap.USDC_AVALANCHE,
}
