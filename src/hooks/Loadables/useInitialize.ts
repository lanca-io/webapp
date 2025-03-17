import { useLoadBalances } from './useLoadBalances'
import { useLoadChains } from './useLoadChains'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadSrcTokens } from './useLoadSrcTokens'
import { useLoadDstTokens } from './useLoadDstTokens'

export const InitializeLoadables = (): null => {
	useLoadChains()
	useLoadAllTokens()
	useLoadSrcTokens()
	useLoadDstTokens()
	useLoadBalances()
	return null
}
