import type { FC, PropsWithChildren } from 'react'
import { LancaClient } from '@lanca/sdk'
import { SDKContext } from './SDKContext'
import { sdkConfiguration } from './ClientConfig'

export const SDKProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const client = new LancaClient(sdkConfiguration)

	return <SDKContext.Provider value={{ client }}>{children}</SDKContext.Provider>
}
