import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../../../../store/tokens/types'

export type BalanceProps = {
	chain: ILancaChain | null
	isLoading: boolean
	items: number
	onTokenSelect: (token: ExtendedToken) => void
}
