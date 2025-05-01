import type { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useSettingsStore } from '../../store/settings/useSettings'
import { useAccount } from 'wagmi'

export const useLoadRoute = () => {
	const { address } = useAccount()
	const { setRoute, setIsLoading } = useRouteStore()
	const { sourceChain, destinationChain, sourceToken, destinationToken, inputValue } = useFormStore()
	const { slippage } = useSettingsStore()

	const client = useLancaSDK()

	const queryFn = useCallback(async () => {
		if (!address || !sourceChain || !destinationChain || !sourceToken || !destinationToken || !inputValue) {
			return null
		}

		try {
			const route = await client.getRoute({
				fromChainId: sourceChain.id,
				toChainId: destinationChain.id,
				fromToken: sourceToken.address as Address,
				toToken: destinationToken.address as Address,
				amount: inputValue,
				fromAddress: address,
				toAddress: address,
				slippageTolerance: slippage,
			})
			return route
		} catch (error) {
			console.error('Error fetching route:', error)
			throw error
		}
	}, [client, address, sourceChain, destinationChain, sourceToken, destinationToken, inputValue, slippage])

	const { data: route, isLoading } = useQuery({
		queryKey: [
			'route',
			{
				address,
				sourceChain,
				destinationChain,
				sourceToken,
				destinationToken,
				inputValue,
				slippage,
			},
		],
		queryFn,
		refetchInterval: 60_000,
		enabled:
			!!address && !!sourceChain && !!destinationChain && !!sourceToken && !!destinationToken && !!inputValue,
	})

	useEffect(() => {
		setIsLoading(isLoading)
	}, [isLoading, setIsLoading])

	useEffect(() => {
		if (route) {
			setRoute(route)
		}
	}, [route, setRoute])
}
