import type { ILancaChain } from '@lanca/sdk'
import { ExtendedToken } from '../../../../store/tokens/types'

export type TokenMenuProps = {
	chain: ILancaChain | null
	tokens: ExtendedToken[]
	isSearchActive: boolean
	searchedTokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}
