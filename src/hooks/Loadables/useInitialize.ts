import { useLoadBalances } from './useLoadBalances'
import { useLoadChains } from './useLoadChains'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadTokens } from './useLoadTokens'
import { useLoadTxExecutionTime } from './useLoadTxExecutionTime'
import { useLoadRoute } from './useLoadRoute'

export const InitializeLoadables = (): null => {
	useLoadChains()
	useLoadAllTokens()
	useLoadTokens()
	useLoadBalances()
	useLoadTxExecutionTime()
	useLoadRoute()
	return null
}
