import { FC, memo, useMemo } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../store/tokens/types'
import { TokenBalances } from '../TokenBalances/TokenBalances'
import { PopularTokens } from '../PopularTokens/PopularTokens'
import { SearchedTokens } from '../SearchedTokens/SearchedTokens'

type TokenMenuProps = {
	chain: ILancaChain | null
	tokens: ExtendedToken[]
	isSearchActive: boolean
	searchedTokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const TokenMenu: FC<TokenMenuProps> = memo(
	({ chain, tokens, searchedTokens, isLoading, isSearchActive, onTokenSelect }) => {
		const handleTokenSelect = useMemo(() => onTokenSelect, [onTokenSelect])

		const balancesComponent = useMemo(
			() => <TokenBalances isLoading={isLoading} chain={chain} items={4} onTokenSelect={handleTokenSelect} />,
			[isLoading, chain, handleTokenSelect],
		)

		const searchResultsComponent = useMemo(
			() => <SearchedTokens tokens={searchedTokens} isLoading={isLoading} onTokenSelect={handleTokenSelect} />,
			[searchedTokens, isLoading, handleTokenSelect],
		)

		const popularTokensComponent = useMemo(
			() => <PopularTokens tokens={tokens} isLoading={isLoading} onTokenSelect={handleTokenSelect} />,
			[tokens, isLoading, handleTokenSelect],
		)

		return (
			<>
				{balancesComponent}
				{isSearchActive ? searchResultsComponent : popularTokensComponent}
			</>
		)
	},
)
