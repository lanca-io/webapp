import { type Address, type Chain, createPublicClient, erc20Abi, formatUnits } from 'viem'
import { http } from 'wagmi'
import { arbitrum, avalanche, base, polygon } from 'wagmi/chains'

export interface IPoolConfig {
	chain: Chain
	conceroContract: Address
	usdcContract: Address
}

const usdcDecimals = 6

export const poolConfigs: Record<string, IPoolConfig> = {
	'8453': {
		chain: base,
		conceroContract: '0x1bb4233765838Ee69076845D10fa231c8cd500a3',
		usdcContract: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
	},
	'42161': {
		chain: arbitrum,
		conceroContract: '0xb26f41a682601c70872B67667b30037f910E6c83',
		usdcContract: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
	},
	'137': {
		chain: polygon,
		conceroContract: '0x1bb4233765838Ee69076845D10fa231c8cd500a3',
		usdcContract: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
	},
	'43114': {
		chain: avalanche,
		conceroContract: '0x1bb4233765838Ee69076845D10fa231c8cd500a3',
		usdcContract: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
	},
}

export const getPoolAmount = async (chainId: string): Promise<string> => {
	const { chain, usdcContract, conceroContract } = poolConfigs[chainId]

	const publicClient = createPublicClient({
		chain,
		transport: http(),
	})

	const data = await publicClient.readContract({
		address: usdcContract,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [conceroContract],
	})

	return formatUnits(data, usdcDecimals)
}
