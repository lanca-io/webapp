import type { ExtendedToken } from '../../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import { Token } from '../Token/Token'
import { ExpandButton } from '../ExpandButton/ExpandButton'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../../hooks/useGetBalances'
import { useFormStore } from '../../../store/form/useFormStore'
import { useTokensStore } from '../../../store/tokens/useTokensStore'
import './TokenBalances.pcss'

type BalanceProps = {
	chain: ILancaChain | null
	items: number
	onTokenSelect: (token: ExtendedToken) => void
	isSearchActive?: boolean
}

export const TokenBalances = memo(
	({ chain, items, onTokenSelect, isSearchActive = false }: BalanceProps): JSX.Element | null => {
		const { address, isConnected } = useAccount()
		const { balances, isLoading } = useGetBalances(chain?.id)
		const { fromToken, toToken } = useFormStore()
		const { allSearchValue, searchValue } = useTokensStore()
		const [shown, setShown] = useState(items)

		const activeSearchValue = isSearchActive ? (chain ? searchValue : allSearchValue) : ''
		const baseFilteredBalances = useMemo(
			() =>
				balances.filter(
					token =>
						!(
							token.address === fromToken?.address &&
							Number(token.chain_id) === Number(fromToken?.chain_id)
						) &&
						!(token.address === toToken?.address && Number(token.chain_id) === Number(toToken?.chain_id)),
				),
			[balances, fromToken, toToken],
		)

		const filteredBalances = useMemo(() => {
			if (!activeSearchValue) return baseFilteredBalances

			const search = activeSearchValue.toLowerCase()
			return baseFilteredBalances.filter(
				token =>
					token.name.toLowerCase().includes(search) ||
					token.symbol.toLowerCase().includes(search) ||
					token.address.toLowerCase().includes(search),
			)
		}, [baseFilteredBalances, activeSearchValue])

		const handleSelect = useCallback(
			(token: ExtendedToken) => {
				return () => onTokenSelect(token)
			},
			[onTokenSelect],
		)

		const toggleExpand = useCallback(() => {
			setShown(prev => (prev === items ? filteredBalances.length : items))
		}, [filteredBalances.length, items])

		useEffect(() => {
			setShown(items)
		}, [activeSearchValue, items])

		if (!isConnected || !address) return null
		if (!isLoading && filteredBalances.length === 0) return null

		const canExpand = filteredBalances.length > items
		const expanded = shown >= filteredBalances.length

		return (
			<div className="token_balances" role="region" aria-label="Your tokens">
				<h2 className="token_balances_title">{'Your Tokens'}</h2>
				{isLoading
					? Array.from({ length: items }).map((_, i) => <TokenSkeleton key={i} />)
					: filteredBalances
							.slice(0, shown)
							.map(token => (
								<Token
									key={`${token.address}-${token.chain_id}`}
									token={token}
									showBalance
									onClick={handleSelect(token)}
								/>
							))}
				{canExpand && (
					<ExpandButton
						isExpanded={expanded}
						onToggle={toggleExpand}
						aria-label={expanded ? 'Show fewer tokens' : 'Show all tokens'}
					/>
				)}
			</div>
		)
	},
)
