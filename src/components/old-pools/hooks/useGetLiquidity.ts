import { useState, useEffect, useCallback } from 'react'
import {
	type IPoolConfig,
	isPoolFullAbi,
	poolConfigs,
	poolLoansInUseAbiITem,
} from '../config/poolConfig'
import { getPublicClient } from '../../../providers/Web3Provider/Web3Provider'
import { erc20Abi, formatUnits } from 'viem'
import { usdcDecimals } from '../config/usdcTokenAddresses'
import { getMaxCap } from './useGetMaxCap'
import { config } from '../../../constants/config'
import { baseSepolia, base } from 'viem/chains'
import { parentPoolBase } from '../config/poolMainnetAddresses'
import { parentPoolBaseSepolia } from '../config/poolTestnetAddresses'

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

		return childrenOnly
			? BigInt(totalLiquidity)
			: Number(formatUnits(BigInt(totalLiquidity), usdcDecimals))
	} catch (error) {
		console.error('Error fetching pool liquidity:', error)
		return childrenOnly ? 0n : 0
	}
}

export const isPoolFilled = async () => {
	const chainId = config.IS_TESTNET ? baseSepolia.id : base.id
	const contractAddress = config.IS_TESTNET
		? parentPoolBaseSepolia
		: parentPoolBase

	try {
		const client = getPublicClient(chainId)
		const data = await client.readContract({
			address: contractAddress,
			functionName: 'isFull',
			abi: isPoolFullAbi,
		})
		return data as boolean
	} catch (error) {
		console.error('Error fetching pool status:', error)
		return false
	}
}

export const useGetLiquidity = () => {
	const [maxCap, setMaxCap] = useState<number>(0)
	const [poolLiquidity, setPoolLiquidity] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [isPoolFull, setIsPoolFull] = useState<boolean>(false)

	const setLiquidityHandle = useCallback(async () => {
		try {
			setIsLoading(true)
			const [cap, newPoolLiquidity, isDepositEnabled] = await Promise.all([
				getMaxCap(),
				getPoolLiquidity(),
				isPoolFilled(),
			])
			setIsPoolFull(isDepositEnabled ?? false)
			setPoolLiquidity(Number(newPoolLiquidity))
			setMaxCap(Number(cap) * config.CHILD_POOLS_COUNT)
		} catch (error) {
			console.error('Error setting liquidity:', error)
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		void setLiquidityHandle()
	}, [setLiquidityHandle])

	return { maxCap, poolLiquidity, isLoading, isPoolFull }
}
