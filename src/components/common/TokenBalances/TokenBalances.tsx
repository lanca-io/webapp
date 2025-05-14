import type { ExtendedToken } from '../../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { memo, useState, useCallback } from 'react'
import { Token } from '../Token/Token'
import { ExpandButton } from '../ExpandButton/ExpandButton'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../../hooks/useGetBalances'
import { useFormStore } from '../../../store/form/useFormStore'
import './TokenBalances.pcss'

type BalanceProps = {
	chain: ILancaChain | null
	items: number
	onTokenSelect: (token: ExtendedToken) => void
}

export const TokenBalances = memo(({ chain, items, onTokenSelect }: BalanceProps): JSX.Element | null => {
	const { address, isConnected } = useAccount()
	const { balances, isLoading } = useGetBalances(chain?.id)
	const { sourceToken, destinationToken } = useFormStore()
	const [shown, setShown] = useState(items)

	const filteredBalances = balances.filter(
		token =>
			!(token.address === sourceToken?.address && token.chain_id === sourceToken?.chain_id) &&
			!(token.address === destinationToken?.address && token.chain_id === destinationToken?.chain_id),
	)

	const handleSelect = useCallback(
		(token: ExtendedToken) => {
			return () => onTokenSelect(token)
		},
		[onTokenSelect],
	)

	const toggleExpand = useCallback(() => {
		setShown(prev => (prev === items ? filteredBalances.length : items))
	}, [filteredBalances.length, items])

	if (!isConnected || !address) return null
	if (!isLoading && filteredBalances.length === 0) return null

	const canExpand = filteredBalances.length > items
	const expanded = shown >= filteredBalances.length

	return (
		<div className="token_balances" role="region" aria-label="Your tokens">
			<h2 className="token_balances_title">Your Tokens</h2>
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
})
