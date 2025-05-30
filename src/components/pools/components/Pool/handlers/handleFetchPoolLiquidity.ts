import { erc20Abi, formatUnits } from 'viem'
import { getPublicClient } from '../../../../../configuration/chains'
import { type IPoolConfig, poolConfigs, poolLoansInUseAbiITem } from '../../../config/poolConfig'
import { usdcDecimals } from '../../../config/usdcTokenAddresses'

export const getLiquidityOnChain = async (poolConfig: IPoolConfig) => {
	const { chain, conceroContract, usdcContract } = poolConfig

	const client = getPublicClient(chain.id)

	try {
		const results = await client.multicall({
			contracts: [
				{
					address: conceroContract,
					abi: poolLoansInUseAbiITem,
					functionName: 'getUsdcLoansInUse',
				},
				{
					address: usdcContract,
					abi: erc20Abi,
					functionName: 'balanceOf',
					args: [conceroContract],
				},
			],
		})

		return results.reduce((acc, item) => {
			const balance = item.status === 'success' ? Number(item.result) : 0
			return balance + acc
		}, 0)
	} catch (error) {
		console.error(`Error fetching liquidity on chain for ${conceroContract}:`, error)
		return 0
	}
}

export const getPoolLiquidity = async (childrenOnly = false) => {
	try {
		const formattedPoolConfigs = poolConfigs.filter(poolConfig => (childrenOnly ? !poolConfig.isParent : true))

		const totalValuesOnChain = await Promise.all(
			formattedPoolConfigs.map(async config => await getLiquidityOnChain(config)),
		)

		const totalLiquidity = totalValuesOnChain.reduce((acc, value) => acc + value, 0)

		if (childrenOnly) {
			return BigInt(totalLiquidity)
		}

		return Number(formatUnits(BigInt(totalLiquidity), usdcDecimals))
	} catch (error) {
		console.error('Error fetching pool liquidity:', error)
		return 0
	}
}
