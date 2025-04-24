import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { useState, useCallback, useMemo } from 'react'
import { Token } from '../Token/Token'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../hooks/useGetBalances'
import { ExpandButton } from '../ExpandButton/ExpandButton'
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
	const [visibleCount, setVisibleCount] = useState<number>(items)

	const loadingTokens = useMemo(
		() =>
			Array.from({ length: items }).map(
				(_, index) =>
					({
						address: `loading-${index}`,
						chain_id: chain?.id || '',
						symbol: '',
						name: '',
						decimals: 18,
						logoURI: '',
					}) as ExtendedToken,
			),
		[items, chain?.id],
	)

	const visibleBalances = useMemo(() => balances.slice(0, visibleCount), [balances, visibleCount])

	const shouldShowExpandButton = useMemo(() => balances.length > items, [balances.length, items])

	const isExpanded = useMemo(() => visibleCount >= balances.length, [visibleCount, balances.length])

	const handleToggleExpand = useCallback(() => {
		setVisibleCount(prevCount => (prevCount < balances.length ? balances.length : items))
	}, [balances.length, items])

	const handleTokenSelect = useCallback((token: ExtendedToken) => () => onTokenSelect(token), [onTokenSelect])

	if (!isConnected || !address || (!isLoading && balances.length === 0)) {
		return null
	}

	return (
		<div className="token_balances">
			<h4 className="token_balances_title">Your Tokens</h4>

			{isLoading
				? loadingTokens.map((token, index) => (
						<Token key={`loading-${index}`} token={token} showBalance={true} isLoading={true} />
					))
				: visibleBalances.map(token => (
						<Token
							key={`${token.address}-${token.chain_id}`}
							token={token}
							showBalance={true}
							onClick={handleTokenSelect(token)}
							isLoading={false}
						/>
					))}

			{shouldShowExpandButton && <ExpandButton isExpanded={isExpanded} onToggle={handleToggleExpand} />}
		</div>
	)
}
