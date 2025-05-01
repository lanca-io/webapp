import type { FC, MouseEvent } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import { memo, useMemo, useCallback } from 'react'
import { format } from '../../utils/new/format'
import { formatTokenAmount } from '../../utils/new/tokens'
import './BalanceInfo.pcss'

type BalanceInfoProps = {
	token: ExtendedToken | null
	setInputValue: (value: string) => void
}

export const BalanceInfo: FC<BalanceInfoProps> = memo(({ token, setInputValue }) => {
	const data = useMemo(() => {
		if (!token) return { value: '0', symbol: '', hasBalance: false }

		const balance = Number(formatTokenAmount(token.balance, token.decimals))
		const hasBalance = balance > 0

		return {
			value: format(balance, 4),
			symbol: token.symbol,
			hasBalance,
			rawBalance: token.balance,
			decimals: token.decimals,
		}
	}, [token])

	const handleMaxClick = useCallback(
		(e: MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (!token?.balance) return
			const formattedBalance = formatTokenAmount(token.balance, token.decimals)
			setInputValue(formattedBalance)
		},
		[token, setInputValue],
	)

	return (
		<div className="balance_info_container">
			<span className="balance_info_title">Balance</span>
			<span className="balance_info_value">{data.value}</span>
			<span className="balance_info_symbol">{data.symbol}</span>
			{data.hasBalance && (
				<button onClick={handleMaxClick} className="balance_info_max_button">
					Max
				</button>
			)}
		</div>
	)
})
