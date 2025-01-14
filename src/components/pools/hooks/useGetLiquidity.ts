import { useState, useEffect, useCallback } from 'react'
import { type IPoolConfig, poolConfigs, poolLoansInUseAbiITem } from '../config/poolConfig'
import { getPublicClient } from '../../../web3/wagmi'
import { erc20Abi, formatUnits } from 'viem'
import { usdcDecimals } from '../config/usdcTokenAddresses'
import { getMaxCap } from './useGetMaxCap'

export const getLiquidityOnChain = async (poolConfig: IPoolConfig) => {
	const { chain, conceroContract, usdcContract } = poolConfig

	const client = getPublicClient(chain.id)

	const results = await client.multicall({
		contracts: [
			{
				address: conceroContract,
				abi: poolLoansInUseAbiITem,
				functionName: 's_loansInUse',
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
}

export const getPoolLiquidity = async (childrenOnly = false) => {
	try {
		const formattedPoolConfigs = poolConfigs.filter(poolConfig => (childrenOnly ? !poolConfig.isParent : true))

		const totalValuesOnChain = await Promise.all(formattedPoolConfigs.map(async config => await getLiquidityOnChain(config)))

		const totalLiquidity = totalValuesOnChain.reduce((acc, value) => acc + value, 0)

		return childrenOnly ? BigInt(totalLiquidity) : Number(formatUnits(BigInt(totalLiquidity), usdcDecimals))
	} catch (error) {
		console.error('Error fetching pool liquidity:', error)
	}
}

export const useGetLiquidity = () => {
	const [maxCap, setMaxCap] = useState<number>(0)
	const [poolLiquidity, setPoolLiquidity] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const setLiquidityHandle = useCallback(async () => {
		try {
			setIsLoading(true)
			const [cap, newPoolLiquidity] = await Promise.all([getMaxCap(), getPoolLiquidity()])

			setPoolLiquidity(Number(newPoolLiquidity))
			setMaxCap(Number(cap))
		} catch (error) {
			console.error('Error setting liquidity:', error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		void setLiquidityHandle()
	}, [setLiquidityHandle])

	return { maxCap, poolLiquidity, isLoading }
}
