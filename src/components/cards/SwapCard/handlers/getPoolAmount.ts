import { type Address, type Chain, createPublicClient, erc20Abi, formatUnits, http } from 'viem'
import { arbitrum, avalanche, base, polygon } from 'wagmi/chains'
import { config } from '../../../../sdk/configs/config'
import { viemChains } from '../../../../sdk/configs/chainsConfig'

export interface IPoolConfig {
	chain: Chain
	conceroContract: Address
	usdcContract: Address
}

const usdcDecimals = 6

export const poolConfigs: Record<string, IPoolConfig> = {
	'8453': {
		chain: base,
		conceroContract: config.CONCERO_POOL_BASE,
		usdcContract: config.USDC_BASE,
	},
	'42161': {
		chain: arbitrum,
		conceroContract: config.CONCERO_POOL_ARBITRUM,
		usdcContract: config.USDC_ARBITRUM,
	},
	'137': {
		chain: polygon,
		conceroContract: config.CONCERO_POOL_POLYGON,
		usdcContract: config.USDC_POLYGON,
	},
	'43114': {
		chain: avalanche,
		conceroContract: config.CONCERO_POOL_AVALANCHE,
		usdcContract: config.USDC_AVALANCHE,
	},
}

export const getPoolAmount = async (chainId: string): Promise<string> => {
	const { usdcContract, conceroContract } = poolConfigs[chainId]

	const publicClient = createPublicClient({
		chain: viemChains[chainId].chain,
		transport: viemChains[chainId].transport ?? http(),
	})

	const data = await publicClient.readContract({
		address: usdcContract,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [conceroContract],
	})

	return formatUnits(data, usdcDecimals)
}
