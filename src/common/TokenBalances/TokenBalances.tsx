import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { useState, useCallback, useMemo } from 'react'
import { Token } from '../Token/Token'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../hooks/useGetBalances'
import { ExpandButton } from '../ExpandButton/ExpandButton'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import './TokenBalances.pcss'

type BalanceProps = {
	chain: ILancaChain | null
	isLoading: boolean
	items: number
	onTokenSelect: (token: ExtendedToken) => void
}

export const TokenBalances: FC<BalanceProps> = ({ chain, items, onTokenSelect }) => {
	const { address, isConnected } = useAccount()
	const { balances, isLoading } = useGetBalances(chain?.id)
	const [shown, setShown] = useState<number>(items)

	const skeletons = useMemo(() => Array.from({ length: items }).map((_, i) => <TokenSkeleton key={i} />), [items])

	const tokens = useMemo(() => balances.slice(0, shown), [balances, shown])

	const canExpand = balances.length > items
	const expanded = shown >= balances.length

	const toggleExpand = useCallback(() => {
		setShown(prev => (prev < balances.length ? balances.length : items))
	}, [balances.length, items])

	const handleSelect = useCallback((token: ExtendedToken) => () => onTokenSelect(token), [onTokenSelect])

	const expandButton = useMemo(
		() => (canExpand ? <ExpandButton isExpanded={expanded} onToggle={toggleExpand} /> : null),
		[canExpand, expanded, toggleExpand],
	)

	const tokenList = useMemo(
		() =>
			tokens.map(token => (
				<Token
					key={`${token.address}-${token.chain_id}`}
					token={token}
					showBalance={true}
					onClick={handleSelect(token)}
					isLoading={false}
				/>
			)),
		[tokens, handleSelect],
	)

	if (!isConnected || !address || (!isLoading && balances.length === 0)) {
		return null
	}

	return (
		<div className="token_balances">
			<h4 className="token_balances_title">Your Tokens</h4>
			{isLoading ? skeletons : tokenList}
			{expandButton}
		</div>
	)
}
