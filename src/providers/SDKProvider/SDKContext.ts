import type { SDKContext as Context } from './types'
import { createContext } from 'react'
import { LancaClient } from '@lanca/sdk'
import { sdkConfiguration } from './ClientConfig'

const initialContext: Context = {
	client: new LancaClient(sdkConfiguration),
}

export const SDKContext = createContext<Context>(initialContext)
