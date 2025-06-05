import type { Address } from 'viem'
import { useRef, useCallback, useState } from 'react'
import { IExecutionConfig, IRouteType } from '@lanca/sdk'
import { useLancaSDK } from '../providers/SDKProvider/useLancaSDK'
import { useExecutionListener } from './useExecutionListener'
import { useSubvariantStore } from '../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../store/subvariant/types'
import { useFormStore } from '../store/form/useFormStore'
import { useGetExectionRoute } from './useGetExecutionRoute'
import { useWalletClient } from 'wagmi'

export const useExecuteRoute = (route: IRouteType | null) => {
	const { state } = useSubvariantStore()
	const { toAddress } = useFormStore()
	const { data: client } = useWalletClient()
	const [isExecuting, setIsExecuting] = useState<boolean>(false)

	const sdk = useLancaSDK()
	const updateHandler = useExecutionListener()
	const { fetchRoute } = useGetExectionRoute()

	const configRef = useRef<IExecutionConfig>({
		updateRouteStatusHook: updateHandler,
	})

	const getFreshRoute = useCallback(
		async (route: IRouteType) => {
			try {
				return (await fetchRoute()) || route
			} catch (error) {
				console.warn('Failed to refresh route before execution:', error)
				return route
			}
		},
		[fetchRoute],
	)

	const executeRoute = useCallback(async () => {
		if (!route) return null
		if (!sdk) throw new Error('SDK not initialized')

		setIsExecuting(true)

		try {
			const freshRoute = await getFreshRoute(route)
			if (state === SplitSubvariantType.SEND && toAddress) {
				// @ts-ignore
				return await sdk.executeRoute(freshRoute, client, configRef.current, toAddress as Address)
			} else {
				// @ts-ignore
				return await sdk.executeRoute(freshRoute, client, configRef.current)
			}
		} catch (error) {
			console.error('Error executing route:', error)
			throw error
		} finally {
			setIsExecuting(false)
		}
	}, [route, sdk, client, updateHandler, state, toAddress, getFreshRoute])

	return {
		executeRoute,
		isExecuting,
	}
}
