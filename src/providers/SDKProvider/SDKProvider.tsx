import type { FC, PropsWithChildren } from 'react'
import { LancaClient } from '@lanca/sdk'
import { SDKContext } from './SDKContext'

export const SDKProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
	const client = new LancaClient()

	return <SDKContext.Provider value={{ client }}>{children}</SDKContext.Provider>
}
