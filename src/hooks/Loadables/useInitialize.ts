import { useLoadBalances } from './useLoadBalances'
import { useLoadChains } from './useLoadChains'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadRoute } from './useLoadRoute'
import { useLoadTokens } from './useLoadTokens'
import { useLoadTxExecutionTime } from './useLoadTxExecutionTime'

export const InitializeLoadables = (): null => {
	useLoadChains()
	useLoadAllTokens()
	useLoadTokens()
	useLoadBalances()
	useLoadRoute()
	useLoadTxExecutionTime()
	return null
}
