import { type Address, type Chain, createPublicClient, erc20Abi, formatUnits, http } from 'viem'
import { arbitrum, avalanche, base, polygon } from 'viem/chains'
import { conceroProxyMap, defaultRpcsConfig } from 'lanca-sdk-demo'

export interface IPoolConfig {
	chain: Chain
	conceroContract: Address
	usdcContract: Address
}

const usdcDecimals = 6

export const poolConfigs: Record<string, IPoolConfig> = {
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
}

export const getPoolAmount = async (chainId: keyof typeof poolConfigs): Promise<string> => {
	const { usdcContract, conceroContract, chain } = poolConfigs[chainId]

	if (!chain) {
		throw new Error(`Chain configuration not found for chainId: ${chainId}`)
	}

	const transport: any = defaultRpcsConfig[chain.id as keyof typeof defaultRpcsConfig] ?? http()

	const publicClient = createPublicClient({
		chain,
		transport,
	})

	const data = await publicClient.readContract({
		address: usdcContract,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [conceroContract],
	})

	return formatUnits(data, usdcDecimals)
}
