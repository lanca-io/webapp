import { memo } from 'react'
import { TokenBalances } from '../TokenBalances/TokenBalances'
import { PopularTokens } from '../PopularTokens/PopularTokens'
import { SearchedTokens } from '../SearchedTokens/SearchedTokens'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../../store/tokens/types'

type MenuProps = {
	chain: ILancaChain | null
	tokens: ExtendedToken[]
	isSearchActive: boolean
	searchedTokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const TokenMenu = memo(
	({ chain, tokens, searchedTokens, isLoading, isSearchActive, onTokenSelect }: MenuProps): JSX.Element => {
		const hasSearchResults = searchedTokens.length > 0

		return (
			<>
				<TokenBalances chain={chain} items={4} onTokenSelect={onTokenSelect} isSearchActive={isSearchActive} />
				{isSearchActive && hasSearchResults ? (
					<SearchedTokens tokens={searchedTokens} isLoading={isLoading} onTokenSelect={onTokenSelect} />
				) : (
					<PopularTokens tokens={tokens} isLoading={isLoading} onTokenSelect={onTokenSelect} />
				)}
			</>
		)
	},
)
