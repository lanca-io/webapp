import { FC, memo, useMemo } from 'react'
import { format } from '../../utils/new/format'
import { formatTokenAmount } from '../../utils/new/tokens'
import './Balance.pcss'

type BalanceData = {
	balance: string
	decimals?: number
	price?: number | null
}

export const Balance: FC<BalanceData> = memo(({ balance, decimals = 18, price }) => {
	const { formattedBalance, usdValue } = useMemo(() => {
		const tokenBalance = formatTokenAmount(balance, decimals)
		const formattedBalance = format(Number(tokenBalance), 3)
		const usdValue = price ? (price * Number(tokenBalance)).toFixed(3) : null

		return { formattedBalance, usdValue }
	}, [balance, decimals, price])

	return (
		<div className="balance_container">
			<p className="balance">{formattedBalance}</p>
			{usdValue && <p className="balance_price_usd">${usdValue}</p>}
		</div>
	)
})
