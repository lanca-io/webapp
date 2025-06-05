import { useLoadBalances } from './useLoadBalances'
import { useLoadChains } from './useLoadChains'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadRouteQuote } from './useLoadRouteQuote'
import { useLoadTokens } from './useLoadTokens'
import { useLoadTxExecutionTime } from './useLoadTxExecutionTime'

export const InitializeLoadables = (): null => {
	useLoadChains()
	useLoadAllTokens()
	useLoadTokens()
	useLoadBalances()
	useLoadRouteQuote()
	useLoadTxExecutionTime()
	return null
}
