import { useCallback, useRef } from 'react'
import { SplitSubvariantType } from '../store/subvariant/types'
import { getWalletClient } from '@wagmi/core'
import { adapter } from '../configuration/wagmi'
import { IExecutionConfig, IRouteType } from '@lanca/sdk'
import { useLancaSDK } from '../providers/SDKProvider/useLancaSDK'
import { useExecutionListener } from './useExecutionListener'
import { useSubvariantStore } from '../store/subvariant/useSubvariantStore'
import { useFormStore } from '../store/form/useFormStore'

export const useExecuteRoute = (route: IRouteType | null) => {
	const { state } = useSubvariantStore()
	const { toAddress } = useFormStore()

	const sdk = useLancaSDK()
	const updateHandler = useExecutionListener()

	const configRef = useRef<IExecutionConfig>({
		updateRouteStatusHook: updateHandler,
	})

	return useCallback(async () => {
		if (!route) return null
		if (!sdk) throw new Error('SDK not initialized')

		try {
			const chainId = Number(route.from.chain.id)
			const client = await getWalletClient(adapter.wagmiConfig, { chainId })

			if (state === SplitSubvariantType.SEND) {
				// @ts-ignore
				return await sdk.executeRoute(route, client, configRef.current, toAddress)
			} else {
				// @ts-ignore
				return await sdk.executeRoute(route, client, configRef.current)
			}
		} catch (error) {
			console.error('Error executing route:', error)
			throw error
		}
	}, [route, sdk, updateHandler, state, toAddress])
}
