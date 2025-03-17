import { useContext } from 'react'
import { SDKContext } from './SDKContext'

export const useLancaSDK = () => {
	const context = useContext(SDKContext)

	if (!context) {
		throw new Error('useLancaClient must be used within an SDKProvider')
	}

	return context.client
}
