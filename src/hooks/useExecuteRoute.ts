import type { Address } from 'viem'
import { useRef, useCallback, useState } from 'react'
import { IExecutionConfig, IRouteType } from '@lanca/sdk'
import { useLancaSDK } from '../providers/SDKProvider/useLancaSDK'
import { useExecutionListener } from './useExecutionListener'
import { useSubvariantStore } from '../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../store/subvariant/types'
import { useFormStore } from '../store/form/useFormStore'
import { useWalletClient } from 'wagmi'
import { trackEvent } from '../hooks/useTracking'
import { category, action } from '../constants/tracking'

export const useExecuteRoute = (route: IRouteType | null) => {
	const { state } = useSubvariantStore()
	const { toAddress } = useFormStore()
	const { data: client } = useWalletClient()
	const [isExecuting, setIsExecuting] = useState(false)

	const sdk = useLancaSDK()
	const updateHandler = useExecutionListener()

	const configRef = useRef<IExecutionConfig>({ updateRouteStatusHook: updateHandler })

	const executeRoute = useCallback(async () => {
		if (!route) return null
		if (!sdk) throw new Error('SDK not initialized')
		if (!client) throw new Error('Wallet client not available')
		setIsExecuting(true)

		try {
			trackEvent({
				category: category.SwapCard,
				action: action.BeginSwap,
				label: 'begin_swap',
				data: { from: route.from, to: route.to },
			})

			if (state === SplitSubvariantType.SEND && toAddress) {
				// @ts-ignore
				return await sdk.executeRoute(route, client, configRef.current, toAddress as Address)
			}
			// @ts-ignore
			return await sdk.executeRoute(route, client, configRef.current)
		} catch (error) {
			console.error('Error executing route:', error)
			throw error
		} finally {
			setIsExecuting(false)
		}
	}, [route, sdk, client, state, toAddress])

	return { executeRoute, isExecuting }
}
