import type { ExtendedToken } from '../../../store/tokens/types'
import { memo, useCallback, useMemo } from 'react'
import { Token } from '../Token/Token'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import { useFormStore } from '../../../store/form/useFormStore'
import { useBalancesStore } from '../../../store/balances/useBalancesStore'
import './SearchedTokens.pcss'

type SearchedTokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const SearchedTokens = memo(({ tokens, isLoading, onTokenSelect }: SearchedTokensProps): JSX.Element | null => {
	const { fromToken, toToken } = useFormStore()
	const { balances } = useBalancesStore()

	const filteredTokens = useMemo(() => {
		return tokens.filter(token => {
			const isSelectedToken =
				(token.address === fromToken?.address && token.chain_id === fromToken?.chain_id) ||
				(token.address === toToken?.address && token.chain_id === toToken?.chain_id)

			if (isSelectedToken) return false

			const isInBalances = balances.some(
				bal => bal.address.toLowerCase() === token.address.toLowerCase() && bal.chain_id === token.chain_id,
			)

			return !isInBalances
		})
	}, [tokens, fromToken, toToken, balances])

	const handleSelect = useCallback(
		(token: ExtendedToken) => {
			return () => onTokenSelect(token)
		},
		[onTokenSelect],
	)

	if (!isLoading && filteredTokens.length === 0) return null

	return (
		<div className="searched_tokens" role="region" aria-label="Search results">
			<h4 className="searched_tokens_title">Tokens</h4>
			{isLoading
				? Array.from({ length: 4 }).map((_, i) => <TokenSkeleton key={i} showBalance={false} />)
				: filteredTokens.map(token => (
						<Token
							key={`${token.address}-${token.chain_id}`}
							token={token}
							showBalance={false}
							onClick={handleSelect(token)}
						/>
					))}
		</div>
	)
})
