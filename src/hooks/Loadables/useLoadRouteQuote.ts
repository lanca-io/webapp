import { type Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'
import { useFormStore } from '../../store/form/useFormStore'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useSettingsStore } from '../../store/settings/useSettings'
import { useCheckLiquidity } from '../useCheckLiquidity'
import { useSubvariantStore } from '../../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../../store/subvariant/types'

const REFRESH_INTERVAL = 60_000

export const useLoadRouteQuote = () => {
	const { address, isConnected } = useAccount()
	const { state } = useSubvariantStore()
	const { setRoute, setIsLoading, setError } = useRouteStore()
	const { fromChain, toChain, fromToken, toToken, fromAmount, amountInputError, addressInputError, toAddress } =
		useFormStore()

	const { isBridge, checkLiquidity } = useCheckLiquidity()
	const { slippage } = useSettingsStore()
	const [timeToRefresh, setTimeToRefresh] = useState<number>(0)
	const sdk = useLancaSDK()

	const effectiveToAddress = useMemo(() => {
		if (state === SplitSubvariantType.SEND) {
			if (toAddress && !addressInputError) {
				return toAddress
			}
			return address as Address
		}
		return address as Address
	}, [state, toAddress, address, addressInputError])

	const canFetch = useMemo(() => {
		const isValidAmount =
			fromAmount !== null &&
			fromAmount &&
			fromAmount !== '0' &&
			fromAmount !== '' &&
			!isNaN(Number(fromAmount)) &&
			Number(fromAmount) > 0

		return Boolean(
			isValidAmount &&
				fromChain?.id &&
				toChain?.id &&
				fromToken?.address &&
				toToken?.address &&
				!amountInputError,
		)
	}, [fromChain, toChain, fromToken, toToken, fromAmount, amountInputError])

	const fetchRoute = useCallback(async () => {
		if (!canFetch || !fromAmount || fromAmount === '0' || fromAmount === '') {
			setError(null)
			return null
		}

		try {
			setError(null)
			if (isBridge(fromChain?.id, toChain?.id) && isConnected) {
				const liquidityResult = await checkLiquidity({
					fromChain,
					toChain,
					fromToken,
					fromAmount,
				})

				if (!liquidityResult.isSuccess) {
					const err = new Error('Insufficient liquidity')
					setError(err.message)
					throw err
				}
			}

			const route = await sdk.getRoute({
				fromChainId: Number(fromChain!.id),
				toChainId: Number(toChain!.id),
				fromToken: fromToken!.address as Address,
				toToken: toToken!.address as Address,
				amount: fromAmount!,
				sender: address as Address,
				slippage: slippage,
			})

			return route
		} catch (error: any) {
			console.error('[fetchRoute] Error:', error)
			if (error.message !== 'Insufficient liquidity') {
				setError('No route found')
			}
			throw error
		}
	}, [
		sdk,
		canFetch,
		fromChain,
		toChain,
		fromToken,
		toToken,
		fromAmount,
		address,
		effectiveToAddress,
		slippage,
		isBridge,
		checkLiquidity,
		setError,
		isConnected,
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
				effectiveToAddress,
			},
		],
		[fromChain?.id, toChain?.id, fromToken?.address, toToken?.address, fromAmount, slippage, effectiveToAddress],
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
		refetchInterval: REFRESH_INTERVAL,
		enabled: canFetch,
		staleTime: REFRESH_INTERVAL,
		refetchOnMount: false,
		refetchOnWindowFocus: false,
	})

	const isRouteLoading = useMemo(() => canFetch && (isLoading || isFetching), [canFetch, isLoading, isFetching])

	useEffect(() => {
		if (route) {
			setError(null)
		}
	}, [route, setError])

	useEffect(() => {
		setRoute(route ?? null)
	}, [route, setRoute])

	useEffect(() => {
		setIsLoading(isRouteLoading)
	}, [isRouteLoading, setIsLoading])

	useEffect(() => {
		if (!canFetch) {
			setRoute(null)
			setIsLoading(false)
			setError(null)
		}
	}, [canFetch, setRoute, setIsLoading, setError])

	useEffect(() => {
		if (!canFetch || !dataUpdatedAt) {
			setTimeToRefresh(0)
			return
		}

		const calculateTime = () => {
			const nextUpdate = dataUpdatedAt + REFRESH_INTERVAL
			return Math.max(0, Math.floor((nextUpdate - Date.now()) / 1000))
		}

		setTimeToRefresh(calculateTime())

		const interval = setInterval(() => {
			const newTime = calculateTime()
			setTimeToRefresh(newTime)
			if (newTime === 0) refetch()
		}, 1000)

		return () => clearInterval(interval)
	}, [dataUpdatedAt, canFetch, refetch])

	return {
		timeToRefresh,
		isRouteLoading,
		error: queryError,
		manualRefetch: refetch,
		route,
	}
}
