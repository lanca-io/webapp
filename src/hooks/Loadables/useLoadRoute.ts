import type { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback, useState, useMemo } from 'react'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useSettingsStore } from '../../store/settings/useSettings'
import { useAccount } from 'wagmi'

const REFRESH_INTERVAL = 90_000

export const useLoadRoute = () => {
	const { address } = useAccount()
	const { setRoute, setIsLoading } = useRouteStore()
	const { sourceChain, destinationChain, sourceToken, destinationToken, amount, error } = useFormStore()
	const { slippage } = useSettingsStore()
	const [timeToRefresh, setTimeToRefresh] = useState(0)
	const sdk = useLancaSDK()

	const queryParams = useMemo(
		() => ({
			address,
			sourceChainId: sourceChain?.id,
			destinationChainId: destinationChain?.id,
			sourceTokenAddress: sourceToken?.address,
			destinationTokenAddress: destinationToken?.address,
			amount,
			slippage,
			error,
		}),
		[
			address,
			sourceChain?.id,
			destinationChain?.id,
			sourceToken?.address,
			destinationToken?.address,
			amount,
			slippage,
			error,
		],
	)

	const fetchRoute = useCallback(async () => {
		if (
			!queryParams.sourceChainId ||
			!queryParams.destinationChainId ||
			!queryParams.sourceTokenAddress ||
			!queryParams.destinationTokenAddress ||
			!queryParams.amount
		) {
			return null
		}

		try {
			return await sdk.getRoute({
				fromChainId: queryParams.sourceChainId,
				toChainId: queryParams.destinationChainId,
				fromToken: queryParams.sourceTokenAddress as Address,
				toToken: queryParams.destinationTokenAddress as Address,
				amount: queryParams.amount,
				fromAddress: queryParams.address!,
				toAddress: queryParams.address!,
				slippageTolerance: queryParams.slippage,
			})
		} catch (error) {
			console.error('Route fetch error:', error)
			throw error
		}
	}, [sdk, queryParams])

	const canFetch = useMemo(
		() =>
			!!queryParams.address &&
			!!queryParams.sourceChainId &&
			!!queryParams.destinationChainId &&
			!!queryParams.sourceTokenAddress &&
			!!queryParams.destinationTokenAddress &&
			!!queryParams.amount &&
			!queryParams.error,
		[queryParams],
	)

	const {
		data: route,
		isLoading,
		dataUpdatedAt,
	} = useQuery({
		queryKey: ['route', queryParams],
		queryFn: fetchRoute,
		refetchInterval: REFRESH_INTERVAL,
		enabled: canFetch,
		staleTime: REFRESH_INTERVAL,
	})

	useEffect(() => {
		if (!canFetch || !dataUpdatedAt) {
			setTimeToRefresh(0)
			return
		}

		const calculateRemaining = () => {
			const nextRefresh = dataUpdatedAt + REFRESH_INTERVAL
			return Math.max(0, Math.floor((nextRefresh - Date.now()) / 1000))
		}

		setTimeToRefresh(calculateRemaining())

		const interval = setInterval(() => {
			setTimeToRefresh(prev => {
				const newValue = calculateRemaining()
				return newValue !== prev ? newValue : prev
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [dataUpdatedAt, canFetch])

	useEffect(() => {
		setIsLoading(isLoading && canFetch)
	}, [isLoading, canFetch, setIsLoading])

	useEffect(() => {
		route ? setRoute(route) : setRoute(null)
	}, [route, setRoute])

	return {
		timeToRefresh,
		isRouteLoading: isLoading && canFetch,
	}
}
