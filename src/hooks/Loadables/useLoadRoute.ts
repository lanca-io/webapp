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
	const { sourceChain, destinationChain, sourceToken, destinationToken, amount, error } = useFormStore()
	const { slippage } = useSettingsStore()
	const [timeToRefresh, setTimeToRefresh] = useState<number>(0)
	const sdk = useLancaSDK()

	const canFetch = useMemo(
		() =>
			!!address &&
			!!sourceChain?.id &&
			!!destinationChain?.id &&
			!!sourceToken?.address &&
			!!destinationToken?.address &&
			!!amount &&
			!error,
		[address, sourceChain, destinationChain, sourceToken, destinationToken, amount, error],
	)

	const fetchRoute = useCallback(async () => {
		if (!canFetch) return null

		try {
			return await sdk.getRoute({
				fromChainId: sourceChain!.id,
				toChainId: destinationChain!.id,
				fromToken: sourceToken!.address as Address,
				toToken: destinationToken!.address as Address,
				amount: amount!,
				fromAddress: address!,
				toAddress: address!,
				slippageTolerance: slippage,
			})
		} catch (error) {
			throw error
		}
	}, [sdk, canFetch, sourceChain, destinationChain, sourceToken, destinationToken, amount, address, slippage])

	const queryKey = useMemo(
		() => [
			'route',
			{
				fromChain: sourceChain?.id,
				toChain: destinationChain?.id,
				fromToken: sourceToken?.address,
				toToken: destinationToken?.address,
				amount,
				slippage,
			},
		],
		[sourceChain?.id, destinationChain?.id, sourceToken?.address, destinationToken?.address, amount, slippage],
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
