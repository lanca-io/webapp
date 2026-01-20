import { useLoadBalances } from './useLoadBalances'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadTokens } from './useLoadTokens'
import { useLoadTxExecutionTime } from './useLoadTxExecutionTime'
import { useLoadRoute } from './useLoadRoute'
import { useLoadPoolsData } from './useLoadPoolsData'

export const InitializeLoadables = (): null => {
	useLoadAllTokens()
	useLoadTokens()
	useLoadBalances()
	useLoadTxExecutionTime()
	useLoadRoute()
	useLoadPoolsData()
	return null
}
