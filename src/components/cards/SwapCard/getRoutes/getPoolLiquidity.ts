import { type PoolConfig } from './types'

import { erc20Abi, formatUnits } from 'viem'
import { arbitrum, avalanche, base, optimism, polygon } from 'viem/chains'
import { conceroProxyMap } from '@lanca/sdk'
import { getPublicClient } from '../../../../configuration/chains'

const usdcDecimals = 6

export const poolConfigs: Record<string, PoolConfig> = {
	'8453': {
		chain: base,
		conceroContract: conceroProxyMap.CONCERO_POOL_BASE,
		usdcContract: conceroProxyMap.USDC_BASE,
	},
	'42161': {
		chain: arbitrum,
		conceroContract: conceroProxyMap.CONCERO_POOL_ARBITRUM,
		usdcContract: conceroProxyMap.USDC_ARBITRUM,
	},
	'137': {
		chain: polygon,
		conceroContract: conceroProxyMap.CONCERO_POOL_POLYGON,
		usdcContract: conceroProxyMap.USDC_POLYGON,
	},
	'43114': {
		chain: avalanche,
		conceroContract: conceroProxyMap.CONCERO_POOL_AVALANCHE,
		usdcContract: conceroProxyMap.USDC_AVALANCHE,
	},
	'10': {
		chain: optimism,
		conceroContract: conceroProxyMap.CONCERO_POOL_OPTIMISM,
		usdcContract: conceroProxyMap.USDC_OPTIMISM,
	},
}

export const getPoolLiquidity = async (chainId: string): Promise<string> => {
	const { usdcContract, conceroContract, chain } = poolConfigs[chainId]

	const publicClient = getPublicClient(chain.id)

	const data = await publicClient.readContract({
		address: usdcContract,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [conceroContract],
	})

	return formatUnits(data, usdcDecimals)
}
