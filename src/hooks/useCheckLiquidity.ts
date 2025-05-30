import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../store/tokens/types'
import { useCallback } from 'react'
import { formatUnits } from 'viem'
import { getPublicClient } from '../configuration/chains'
import { erc20Abi } from 'viem'
import { poolAddresses } from '../configuration/addresses'
import { usdcAddresses } from '../configuration/addresses'

const USDC_DECIMALS = 6

type LiquidityCheckParams = {
	fromChain: ILancaChain | null
	toChain: ILancaChain | null
	fromToken: ExtendedToken | null
	fromAmount: string | null
}

type LiquidityResult = {
	isSuccess: boolean
	error: string | null
	poolAmount?: string
}

export const useCheckLiquidity = () => {
	const getPoolLiquidity = useCallback(async (chainId: string): Promise<string> => {
		const conceroContract = poolAddresses[chainId]
		const usdcContract = usdcAddresses[chainId]
		const client = getPublicClient(Number(chainId))

		const data = await client.readContract({
			address: usdcContract,
			abi: erc20Abi,
			functionName: 'balanceOf',
			args: [conceroContract],
		})

		return formatUnits(data, USDC_DECIMALS)
	}, [])

	const checkLiquidity = useCallback(
		async (params: LiquidityCheckParams): Promise<LiquidityResult> => {
			const { fromChain, toChain, fromToken, fromAmount } = params

			const isBridge = fromChain?.id !== toChain?.id

			if (!isBridge || !toChain || !fromToken || !fromAmount) {
				return {
					isSuccess: true,
					error: null,
				}
			}

			try {
				const poolAmount = await getPoolLiquidity(toChain.id)
				const decimals = Number(fromToken.decimals)
				const normalizedAmount = Number(fromAmount) / 10 ** decimals
				const fromAmountUsd = normalizedAmount * (fromToken.priceUsd ?? 0)

				if (fromAmountUsd > Number(poolAmount)) {
					return {
						isSuccess: false,
						error: 'Insufficient liquidity in destination chain',
						poolAmount,
					}
				}

				return {
					isSuccess: true,
					error: null,
					poolAmount,
				}
			} catch (error) {
				console.error('Error checking liquidity:', error)
				return {
					isSuccess: false,
					error: 'Failed to check destination chain liquidity',
				}
			}
		},
		[getPoolLiquidity],
	)

	const isBridge = useCallback((fromChainId: string | undefined, toChainId: string | undefined): boolean => {
		return !!fromChainId && !!toChainId && fromChainId !== toChainId
	}, [])

	return {
		checkLiquidity,
		isBridge,
	}
}
