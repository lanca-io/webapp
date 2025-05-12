import { useCallback, useRef } from 'react'
import { getWalletClient } from '@wagmi/core'
import { config } from '../web3/wagmi'
import { IExecutionConfig, IRouteType } from '@lanca/sdk'
import { useLancaSDK } from '../providers/SDKProvider/useLancaSDK'
import { useExecutionListener } from './useExecutionListener'

export const useExecuteRoute = (route: IRouteType | null) => {
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
			const client = await getWalletClient(config, { chainId })

			// @ts-ignore
			return await sdk.executeRoute(route, client, configRef.current)
		} catch (error) {
			console.error('Error executing route:', error)
			throw error
		}
	}, [route, sdk, updateHandler])
}
