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
	const { sourceChain, destinationChain, sourceToken, destinationToken, amount, error } = useFormStore()
	const { slippage } = useSettingsStore()

	const client = useLancaSDK()

	const queryFn = useCallback(async () => {
		if (!address || !sourceChain || !destinationChain || !sourceToken || !destinationToken || !amount) {
			return null
		}

		console.log(amount, 'This is the amount')
		console.log(sourceChain, 'This is the source chain')
		console.log(destinationChain, 'This is the destination chain')
		console.log(sourceToken, 'This is the source token')
		console.log(destinationToken, 'This is the destination token')
		console.log(address, 'This is the address')
		console.log(slippage, 'This is the slippage')

		try {
			const route = await client.getRoute({
				fromChainId: sourceChain.id,
				toChainId: destinationChain.id,
				fromToken: sourceToken.address as Address,
				toToken: destinationToken.address as Address,
				amount: amount,
				fromAddress: address,
				toAddress: address,
				slippageTolerance: slippage,
			})
			return route
		} catch (error) {
			console.error('Error fetching route:', error)
			throw error
		}
	}, [client, address, sourceChain, destinationChain, sourceToken, destinationToken, amount, slippage])

	const queryEnabled =
		!!address && !!sourceChain && !!destinationChain && !!sourceToken && !!destinationToken && !!amount && !error

	const { data: route, isLoading } = useQuery({
		queryKey: [
			'route',
			{
				address,
				sourceChain,
				destinationChain,
				sourceToken,
				destinationToken,
				amount,
				slippage,
				error,
			},
		],
		queryFn,
		refetchInterval: 60_000,
		enabled: queryEnabled,
	})

	useEffect(() => {
		setIsLoading(isLoading && queryEnabled)
	}, [isLoading, queryEnabled, setIsLoading])

	useEffect(() => {
		if (route) {
			setRoute(route)
		} else if (error) {
			setRoute(null)
		}
	}, [route, error, setRoute])
}
