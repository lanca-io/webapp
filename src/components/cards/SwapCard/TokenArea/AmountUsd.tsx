import { numberToFormatString } from '../../../../utils/formatting'
import type { TokenAreaState } from './useTokenAreaReducer/types'
import { type Balance, type SwapStateDirection } from '../swapReducer/types'
import { useTranslation } from 'react-i18next'
import classNames from './TokenArea.module.pcss'

interface AmountUsdProps {
	state: TokenAreaState
	balance: Balance | null
	selection: SwapStateDirection
	direction: 'from' | 'to'
	handleMaxButtonClick: () => void
}

export function AmountUsd({ state, balance, selection, direction, handleMaxButtonClick }: AmountUsdProps) {
	const { t } = useTranslation()

	const formatedBalance = numberToFormatString(Number(balance?.amount.rounded), 4, true)

	if (direction === 'from') {
		return (
			<div className="row jsb">
				<div className={classNames.amountUsdContainer}>
					{state.isFocused && !selection.amount && balance ? (
						<h5 className={classNames.maxButton} onMouseDown={handleMaxButtonClick}>
							Max: {formatedBalance}
						</h5>
					) : !state.isFocused && selection.amount === '' ? (
						<h5>{t('tokenArea.enterAmount')}</h5>
					) : (
						<h5>{`$${numberToFormatString((selection.token.priceUsd ?? 0) * Number(selection.amount), 2)}`}</h5>
					)}
				</div>
				{!!balance && (
					<h5 className={classNames.balance}>
						Balance: {formatedBalance} {selection.token.symbol}
					</h5>
				)}
			</div>
		)
	} else {
		return (
			<div className={classNames.amountUsdContainer}>
				<h5>{`$${numberToFormatString(Number(selection.amount_usd), 2)}`}</h5>
			</div>
		)
	}
}
