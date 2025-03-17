import type { FC } from 'react'
import { Balance } from './Balance/Balance'
import { Popular } from './Popular/Popular'
import { SearchTokens } from './SearchTokens/SearchTokens'
import { TokenMenuProps } from './types'

export const TokenMenu: FC<TokenMenuProps> = ({ chain, tokens, searchedTokens, isLoading, isSearchActive }) => {
	return (
		<>
			<Balance isLoading={isLoading} chain={chain} items={4} />
			{isSearchActive ? (
				<SearchTokens tokens={searchedTokens} isLoading={isLoading} />
			) : (
				<Popular tokens={tokens} isLoading={isLoading} />
			)}
		</>
	)
}
