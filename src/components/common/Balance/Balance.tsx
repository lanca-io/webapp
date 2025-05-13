import { memo } from 'react'
import { format } from '../../../utils/new/format'
import { formatTokenAmount } from '../../../utils/new/tokens'
import './Balance.pcss'

type BalanceProps = {
	balance: string
	decimals?: number
	price?: number | null
}

export const Balance = memo(({ balance, decimals = 18, price }: BalanceProps): JSX.Element => {
	const tokenBalance = formatTokenAmount(balance, decimals)
	const formattedBalance = format(Number(tokenBalance), 3)
	const usdValue = price
		? new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 3,
				maximumFractionDigits: 3,
			}).format(price * Number(tokenBalance))
		: null

	return (
		<div className="balance_container" role="group" aria-label="Token balance">
			<p className="balance" aria-label={`Token amount: ${formattedBalance}`}>
				{formattedBalance}
			</p>
			{usdValue && (
				<p className="balance_price_usd" aria-label="USD value">
					{usdValue}
				</p>
			)}
		</div>
	)
})
