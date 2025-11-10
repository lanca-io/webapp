import { useLoadBalances } from './useLoadBalances'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadTokens } from './useLoadTokens'
import { useLoadTxExecutionTime } from './useLoadTxExecutionTime'
import { useLoadRoute } from './useLoadRoute'
import { useLoadPosthogInstance } from './useLoadPosthogInstance'

export const InitializeLoadables = (): null => {
	useLoadPosthogInstance()
	useLoadAllTokens()
	useLoadTokens()
	useLoadBalances()
	useLoadTxExecutionTime()
	useLoadRoute()
	return null
}
