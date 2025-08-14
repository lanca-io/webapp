import { useEffect, useMemo, useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Address } from 'viem'
import { ILancaChain, Status } from '@lanca/sdk'
import { SplitSubvariantType } from '../../store/subvariant/types'
import { useAccount } from 'wagmi'
import { useSubvariantStore } from '../../store/subvariant/useSubvariantStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useCheckLiquidity } from '../useCheckLiquidity'
import { ExtendedToken } from '../../store/tokens/types'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useSettingsStore } from '../../store/settings/useSettings'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'
import { useTxExecutionStore } from '../../store/tx-execution/useTxExecutionStore'

const REFRESH_INTERVAL = 60_000 // 60 seconds

export const useLoadRoute = () => {
	const { address, isConnected } = useAccount()
	const { state } = useSubvariantStore()
	const { isBridge, checkLiquidity } = useCheckLiquidity()
	const { slippage } = useSettingsStore()
	const { setRoute, setIsLoading, setError } = useRouteStore()
	const { fromChain, toChain, fromToken, toToken, fromAmount, toAddress, amountInputError } = useFormStore()
	const { overallStatus } = useTxExecutionStore()
	const sdk = useLancaSDK()

	const [refreshTime, setRefreshTime] = useState<number>(0)

	const receiver = useMemo(
		() => (state === SplitSubvariantType.SEND && toAddress ? toAddress : address),
		[state, toAddress, address],
	)

	const validAmount = useMemo(() => {
		if (amountInputError || !fromAmount) return false
		const num = Number(fromAmount)
		return isFinite(num) && num > 0
	}, [fromAmount, amountInputError])

	const hasParams = useMemo(
		() => Boolean(fromChain && toChain && fromToken?.address && toToken?.address && !amountInputError),
		[fromChain, toChain, fromToken, toToken, amountInputError],
	)

	const checkHasLiquidity = async (
		srcChain: ILancaChain,
		dstChain: ILancaChain,
		token: ExtendedToken,
		amount: string,
	) => {
		if (isBridge(srcChain?.id, dstChain?.id) && isConnected) {
			const lq = await checkLiquidity({
				fromChain: srcChain,
				toChain: dstChain,
				fromToken: token,
				fromAmount: amount,
			})
			return lq.isSuccess
		}
		return true
	}

	const fetchRoute = useCallback(async () => {
		if (!hasParams || !validAmount) {
			setError(null)
			return null
		}

		const liquid = await checkHasLiquidity(
			fromChain as ILancaChain,
			toChain as ILancaChain,
			fromToken as ExtendedToken,
			fromAmount as string,
		)

		if (!liquid) {
			setError('Insufficient liquidity')
			setRoute(null)
			return null
		}

		const params = {
			fromChainId: fromChain!.id,
			toChainId: toChain!.id,
			fromToken: fromToken!.address as Address,
			toToken: toToken!.address as Address,
			amount: fromAmount!,
			fromAddress: address as Address,
			toAddress: receiver as Address,
			slippageTolerance: slippage,
		}

		try {
			const routeRes = await sdk.getRoute(params)
			if (!routeRes) {
				setError('No route found')
				setRoute(null)
				return null
			}
			return routeRes
		} catch {
			setError('No route found')
			setRoute(null)
			return null
		}
	}, [
		hasParams,
		validAmount,
		fromChain,
		toChain,
		fromToken,
		fromAmount,
		receiver,
		slippage,
		checkHasLiquidity,
		sdk,
		setError,
		setRoute,
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
				receiver,
			},
		],
		[fromChain?.id, toChain?.id, fromToken?.address, toToken?.address, fromAmount, slippage, receiver],
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
	}, [route, queryError, setRoute, setError])

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
		if (overallStatus !== Status.NOT_STARTED || !route || !dataUpdatedAt) {
			setRefreshTime(0)
			return
		}

		const calcTime = () => {
			const next = dataUpdatedAt + REFRESH_INTERVAL
			return Math.max(0, Math.floor((next - Date.now()) / 1000))
		}

		setRefreshTime(calcTime())

		const interval = setInterval(() => {
			const t = calcTime()
			setRefreshTime(t)
			if (t === 0) refetch()
		}, 1000)

		return () => clearInterval(interval)
	}, [overallStatus, dataUpdatedAt, refetch, route])

	return {
		route,
		isLoading,
		isFetching,
		timeToRefresh: refreshTime,
		manualRefetch: refetch,
		error: queryError,
	}
}
