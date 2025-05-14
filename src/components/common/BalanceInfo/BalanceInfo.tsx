import type { ExtendedToken } from '../../../store/tokens/types'
import { memo, useCallback, useMemo } from 'react'
import { format } from '../../../utils/new/format'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { useFormStore } from '../../../store/form/useFormStore'
import './BalanceInfo.pcss'

type BalanceInfoProps = {
	token: ExtendedToken | null
	showMax?: boolean
}

export const BalanceInfo = memo(({ token, showMax = true }: BalanceInfoProps): JSX.Element => {
	const { setInputValue } = useFormStore()

	console.log('This is the token', token)

	const { displayValue, symbol, hasBalance } = useMemo(() => {
		if (!token?.balance) return { displayValue: '0', symbol: '', hasBalance: false }

		const balance = Number(formatTokenAmount(token.balance, token.decimals))
		return {
			displayValue: format(balance, 4),
			symbol: token.symbol,
			hasBalance: balance > 0,
		}
	}, [token])

	const handleMaxClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault()
			if (!token?.balance) return
			setInputValue(formatTokenAmount(token.balance, token.decimals))
		},
		[token, setInputValue],
	)

	return (
		<div className="balance_info_container" role="group" aria-label="Balance information">
			<span className="balance_info_title">Balance</span>
			<span className="balance_info_value" aria-label={`Current balance: ${displayValue}`}>
				{displayValue}
			</span>
			<span className="balance_info_symbol" aria-label="Token symbol">
				{symbol}
			</span>
			{hasBalance && showMax && (
				<button
					onClick={handleMaxClick}
					className="balance_info_max_button"
					type="button"
					aria-label="Set maximum amount"
				>
					Max
				</button>
			)}
		</div>
	)
})
