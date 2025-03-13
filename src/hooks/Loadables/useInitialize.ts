import { useLoadBalances } from './useLoadBalances'
import { useLoadChains } from './useLoadChains'
import { useLoadTokens } from './useLoadTokens'

export const InitializeLoadables = (): null => {
	useLoadChains()
	useLoadTokens()
	useLoadBalances()
	return null
}
