import { FC, memo } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../store/tokens/types'
import { TokenBalances } from '../TokenBalances/TokenBalances'
import { PopularTokens } from '../PopularTokens/PopularTokens'
import { SearchedTokens } from '../SearchedTokens/SearchedTokens'

type MenuProps = {
	chain: ILancaChain | null
	tokens: ExtendedToken[]
	isSearchActive: boolean
	searchedTokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const TokenMenu: FC<MenuProps> = memo(
	({ chain, tokens, searchedTokens, isLoading, isSearchActive, onTokenSelect }) => (
		<>
			<TokenBalances isLoading={isLoading} chain={chain} items={4} onTokenSelect={onTokenSelect} />
			{isSearchActive ? (
				<SearchedTokens tokens={searchedTokens} isLoading={isLoading} onTokenSelect={onTokenSelect} />
			) : (
				<PopularTokens tokens={tokens} isLoading={isLoading} onTokenSelect={onTokenSelect} />
			)}
		</>
	),
)
