import { erc20Abi, formatUnits } from 'viem'
import { getPublicClient } from '../../../../../providers/Web3Provider/Web3Provider'
import {
	type IPoolConfig,
	poolConfigs,
	poolLoansInUseAbiITem,
} from '../../../config/poolConfig'
import { usdcDecimals } from '../../../config/usdcTokenAddresses'

export const getLiquidityOnChain = async (poolConfig: IPoolConfig) => {
	const { chain, conceroContract, usdcContract } = poolConfig

	const client = getPublicClient(chain.id)

	try {
		const [loansInUse, usdcBalance] = await Promise.all([
			client.readContract({
				address: conceroContract,
				abi: poolLoansInUseAbiITem,
				functionName: 'getUsdcLoansInUse',
			}),
			client.readContract({
				address: usdcContract,
				abi: erc20Abi,
				functionName: 'balanceOf',
				args: [conceroContract],
			}),
		])

		return Number(loansInUse) + Number(usdcBalance)
	} catch (error) {
		console.error(
			`Error fetching liquidity on chain for ${conceroContract}:`,
			error,
		)
		return 0
	}
}

export const getPoolLiquidity = async (childrenOnly = false) => {
	try {
		const formattedPoolConfigs = poolConfigs.filter(poolConfig =>
			childrenOnly ? !poolConfig.isParent : true,
		)

		const totalValuesOnChain = await Promise.all(
			formattedPoolConfigs.map(
				async config => await getLiquidityOnChain(config),
			),
		)

		const totalLiquidity = totalValuesOnChain.reduce(
			(acc, value) => acc + value,
			0,
		)

		if (childrenOnly) {
			return BigInt(totalLiquidity)
		}

		return Number(formatUnits(BigInt(totalLiquidity), usdcDecimals))
	} catch (error) {
		console.error('Error fetching pool liquidity:', error)
		return childrenOnly ? 0n : 0
	}
}
