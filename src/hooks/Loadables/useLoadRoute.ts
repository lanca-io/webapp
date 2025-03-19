import type { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useSettings } from '../../store/settings/useSettings'
import { useAccount } from 'wagmi'

export const useLoadRoute = () => {
	const { address } = useAccount()
	const { setRoutes, setLoading, setError } = useRouteStore()
	const { srcChain, dstChain, srcToken, dstToken, amount } = useFormStore()
	const { settings } = useSettings()

	const slippage = settings.slippage
	const client = useLancaSDK()

	const queryFn = useCallback(async () => {
		if (!address || !srcChain || !dstChain || !srcToken || !dstToken || !amount) {
			return null
		}

		const route = await client.getRoute({
			fromChainId: srcChain.id,
			toChainId: dstChain.id,
			fromToken: srcToken.address as Address,
			toToken: dstToken.address as Address,
			amount: amount!,
			fromAddress: address,
			toAddress: address,
			slippageTolerance: slippage!,
		})
		return route
	}, [client, address, srcChain, dstChain, srcToken, dstToken, amount, slippage])

	const {
		data: route,
		isError,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['route', { address, srcChain, dstChain, srcToken, dstToken, amount, slippage }],
		queryFn,
		refetchInterval: 60_000,
		enabled: !!address && !!srcChain && !!dstChain && !!srcToken && !!dstToken && !!amount,
	})

	useEffect(() => {
		setLoading(isLoading)
	}, [isLoading, setLoading])

	useEffect(() => {
		if (route) {
			setRoutes(route)
		}
	}, [route, setRoutes])

	useEffect(() => {
		if (isError && error instanceof Error) {
			setError(error.message)
		}
	}, [isError, error, setError])
}
