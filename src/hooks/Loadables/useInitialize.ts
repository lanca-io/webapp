import { useLoadBalances } from './useLoadBalances'
import { useLoadChains } from './useLoadChains'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadSrcTokens } from './useLoadSrcTokens'
import { useLoadDstTokens } from './useLoadDstTokens'
import { useLoadRoute } from './useLoadRoute'

export const InitializeLoadables = (): null => {
	useLoadChains()
	useLoadAllTokens()
	useLoadSrcTokens()
	useLoadDstTokens()
	useLoadBalances()
	useLoadRoute()
	return null
}
