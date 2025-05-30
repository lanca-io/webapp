import type { SDKContext as Context } from './types'
import { createContext } from 'react'
import { LancaClient } from '@lanca/sdk'

const initialContext: Context = {
	client: new LancaClient(),
}

export const SDKContext = createContext<Context>(initialContext)
