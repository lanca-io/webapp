import type { Address } from 'viem'
import { zeroAddress } from 'viem'
import { SplitSubvariantType } from '../../store/subvariant/types'
import { useAccount } from 'wagmi'
import { useSubvariantStore } from '../../store/subvariant/useSubvariantStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useCheckLiquidity } from '../useCheckLiquidity'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { ILancaChain } from '@lanca/sdk'
import { ExtendedToken } from '../../store/tokens/types'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useSettingsStore } from '../../store/settings/useSettings'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'
import { useQuery } from '@tanstack/react-query'
import { useTxExecutionStore } from '../../store/tx-execution/useTxExecutionStore'
import { Status } from '@lanca/sdk'

const REFRESH_INTERVAL = 60_000

export const useLoadRoute = () => {
	const { address, isConnected } = useAccount()
	const { state } = useSubvariantStore()
	const { isBridge, checkLiquidity } = useCheckLiquidity()
	const { slippage } = useSettingsStore()
	const { setRoute, setIsLoading, setError } = useRouteStore()
	const { fromChain, toChain, fromToken, toToken, fromAmount, toAddress, amountInputError } = useFormStore()
	const { overallStatus } = useTxExecutionStore()

	const [refreshTime, setRefreshTime] = useState<number>(0)

	const sdk = useLancaSDK()

	const sender: Address = useMemo(() => {
		return state === SplitSubvariantType.SEND && toAddress ? toAddress : (address ?? zeroAddress)
	}, [state, toAddress, address])

	const validAmount = useMemo(() => {
		if (amountInputError || !fromAmount) return false

		const num = Number(fromAmount)
		if (isNaN(num) || !isFinite(num) || num <= 0) return false

		return true
	}, [fromAmount, amountInputError])

	const hasParams = useMemo(() => {
		return Boolean(fromChain && toChain && fromToken?.address && toToken?.address && !amountInputError)
	}, [fromChain, toChain, fromToken, toToken, amountInputError])

	const hasLiquidity = async (
		fromChain: ILancaChain,
		toChain: ILancaChain,
		fromToken: ExtendedToken,
		fromAmount: string,
	): Promise<boolean> => {
		const hasBridge: boolean = isBridge(fromChain?.id, toChain?.id)

		if (hasBridge && isConnected) {
			const liquidity = await checkLiquidity({
				fromChain,
				toChain,
				fromToken,
				fromAmount,
			})

			if (liquidity.isSuccess) return true

			return false
		}

		return true
	}

	const fetchRoute = useCallback(async () => {
		setRoute(null)

		if (!hasParams || !validAmount) {
			setError(null)
			return null
		}

		try {
			const isRouteLiquid = await hasLiquidity(
				fromChain as ILancaChain,
				toChain as ILancaChain,
				fromToken as ExtendedToken,
				fromAmount as string,
			)

			if (!isRouteLiquid) {
				setError('Insufficient liquidity')
				setRoute(null)
				return null
			}

			const parameters = {
				fromChainId: Number(fromChain?.id),
				toChainId: Number(toChain?.id),
				fromToken: fromToken?.address as Address,
				toToken: toToken?.address as Address,
				amount: fromAmount as string,
				sender: sender as Address,
				slippage: slippage,
			}

			const route = await sdk.getRoute(parameters)

			if (!route) {
				setError('No route found')
				setRoute(null)
				return null
			}

			return route
		} catch (e) {
			setError('No route found')
			setRoute(null)
			throw e
		}
	}, [
		hasParams,
		validAmount,
		fromChain,
		toChain,
		fromToken,
		fromAmount,
		sender,
		slippage,
		hasLiquidity,
		sdk,
		setError,
	])

	const queryKey = useMemo(
		() => [
			'route',
			{
				fromChain: fromChain?.id,
				toChain: toChain?.id,
				fromToken: fromToken?.address,
				toToken: toToken?.address,
				amount: fromAmount,
				slippage,
				sender,
			},
		],
		[fromChain?.id, toChain?.id, fromToken?.address, toToken?.address, fromAmount, slippage, sender],
	)

	const {
		data: route,
		isLoading,
		isFetching,
		dataUpdatedAt,
		refetch,
		error: queryError,
	} = useQuery({
		queryKey,
		queryFn: fetchRoute,
		retry: false,

		enabled: hasParams && validAmount,
		staleTime: REFRESH_INTERVAL,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})

	useEffect(() => {
		if (queryError) {
			setRoute(null)
			return
		}
		setRoute(route ?? null)
		if (route) setError(null)
	}, [route, setRoute, setError])

	useEffect(() => {
		if (!hasParams || !validAmount) {
			setRoute(null)
			setIsLoading(false)
			setError(null)
			return
		}

		setIsLoading(isLoading || isFetching)
	}, [hasParams, validAmount, isLoading, isFetching, setIsLoading, setRoute, setError])

	useEffect(() => {
		if (overallStatus !== Status.NOT_STARTED) {
			setRefreshTime(0)
			return
		}

		if (!route || !dataUpdatedAt) {
			setRefreshTime(0)
			return
		}

		const calculateTime = () => {
			const nextUpdate = dataUpdatedAt + REFRESH_INTERVAL
			return Math.max(0, Math.floor((nextUpdate - Date.now()) / 1000))
		}

		setRefreshTime(calculateTime())

		const interval = setInterval(() => {
			const newTime = calculateTime()
			setRefreshTime(newTime)

			if (newTime === 0) {
				refetch()
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [overallStatus, route, dataUpdatedAt, queryKey, refetch])

	return {
		route,
		isLoading,
		isFetching,
		timeToRefresh: refreshTime,
		manualRefetch: refetch,
		error: queryError,
	}
}
