import type { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'
import { useFormStore } from '../../store/form/useFormStore'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useSettingsStore } from '../../store/settings/useSettings'

const REFRESH_INTERVAL = 90_000

export const useLoadRoute = () => {
	const { address } = useAccount()
	const { setRoute, setIsLoading } = useRouteStore()
	const { fromChain, toChain, fromToken, toToken, fromAmount, amountInputError } = useFormStore()
	const { slippage } = useSettingsStore()
	const [timeToRefresh, setTimeToRefresh] = useState<number>(0)
	const sdk = useLancaSDK()

	const canFetch = useMemo(
		() =>
			!!address &&
			!!fromChain?.id &&
			!!toChain?.id &&
			!!fromToken?.address &&
			!!toToken?.address &&
			!!fromAmount &&
			!amountInputError,
		[address, fromChain, toChain, fromToken, toToken, fromAmount, amountInputError],
	)

	const fetchRoute = useCallback(async () => {
		if (!canFetch) return null

		try {
			return await sdk.getRoute({
				fromChainId: fromChain!.id,
				toChainId: toChain!.id,
				fromToken: fromToken!.address as Address,
				toToken: toToken!.address as Address,
				amount: fromAmount!,
				fromAddress: address!,
				toAddress: address!,
				slippageTolerance: slippage,
			})
		} catch (error) {
			throw error
		}
	}, [sdk, canFetch, fromChain, toChain, fromToken, toToken, fromAmount, address, slippage])

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
			},
		],
		[fromChain?.id, toChain?.id, fromToken?.address, toToken?.address, fromAmount, slippage],
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
		refetchInterval: REFRESH_INTERVAL,
		enabled: canFetch,
		staleTime: REFRESH_INTERVAL,
	})

	const isRouteLoading = useMemo(() => canFetch && (isLoading || isFetching), [canFetch, isLoading, isFetching])

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

			if (newTime === 0) {
				refetch()
			}
		}, 1000)

		return () => clearInterval(interval)
	}, [dataUpdatedAt, canFetch, refetch])

	useEffect(() => {
		setRoute(route ?? null)
	}, [route, setRoute])

	useEffect(() => {
		setIsLoading(isRouteLoading)
	}, [isRouteLoading, setIsLoading])

	return {
		timeToRefresh,
		isRouteLoading,
		error: queryError,
		manualRefetch: refetch,
		route,
	}
}
