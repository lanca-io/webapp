import { useLoadBalances } from './useLoadBalances'
import { useLoadChains } from './useLoadChains'
import { useLoadAllTokens } from './useLoadAllTokens'
import { useLoadRoute } from './useLoadRoute'
import { useLoadTokens } from './useLoadTokens'

export const InitializeLoadables = (): null => {
	useLoadChains()
	useLoadAllTokens()
	useLoadTokens()
	useLoadBalances()
	useLoadRoute()
	return null
}
