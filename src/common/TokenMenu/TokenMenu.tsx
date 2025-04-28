import type { FC } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../store/tokens/types'
import { useMemo } from 'react'
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

export const TokenMenu: FC<MenuProps> = ({
	chain,
	tokens,
	searchedTokens,
	isLoading,
	isSearchActive,
	onTokenSelect,
}) => {
	const balances = useMemo(
		() => <TokenBalances isLoading={isLoading} chain={chain} items={4} onTokenSelect={onTokenSelect} />,
		[isLoading, chain, onTokenSelect],
	)

	const popularTokens = useMemo(
		() => <PopularTokens tokens={tokens} isLoading={isLoading} onTokenSelect={onTokenSelect} />,
		[tokens, isLoading, onTokenSelect],
	)

	const searchResults = useMemo(
		() => <SearchedTokens tokens={searchedTokens} isLoading={isLoading} onTokenSelect={onTokenSelect} />,
		[searchedTokens, isLoading, onTokenSelect],
	)

	return (
		<>
			{balances}
			{isSearchActive ? searchResults : popularTokens}
		</>
	)
}
