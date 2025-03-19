import type { FC } from 'react'
import type { BalanceDisplayProps } from './types'
import { format } from '../../../../utils/new/format'
import classNames from './BalanceDisplay.module.pcss'
import { formatTokenAmount } from '../../../../utils/new/tokens'

export const BalanceDisplay: FC<BalanceDisplayProps> = ({ token }) => {
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const formattedBalance = Number(formatTokenAmount(balance, token?.decimals ?? 18))

	return (
		<div className={classNames['balance-container']}>
			<span className={classNames['balance-title']}>Balance</span>
			<span className={classNames['balance-value']}>{format(formattedBalance, 4)}</span>
			<span className={classNames['balance-symbol']}>{symbol}</span>
			<button onClick={() => {}} className={classNames['max-button']}>
				Max
			</button>
		</div>
	)
}
