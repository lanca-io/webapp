import { numberToFormatString } from '../../../../utils/formatting'
import type { TokenAreaState } from './useTokenAreaReducer/types'
import { type Balance, type SwapStateDirection } from '../swapReducer/types'
import { useTranslation } from 'react-i18next'
import classNames from './TokenArea.module.pcss'
import { Loader } from '../../../layout/Loader/Loader'

interface AmountUsdProps {
	state: TokenAreaState
	balance: Balance | null
	selection: SwapStateDirection
	direction: 'from' | 'to'
	handleMaxButtonClick: () => void
	loading: boolean
}

export function AmountUsd({ state, balance, selection, direction, handleMaxButtonClick, loading }: AmountUsdProps) {
	const { t } = useTranslation()

	const formatedBalance = numberToFormatString(Number(balance?.amount.rounded), 4, true)

	if (direction === 'from') {
		return (
			<div className="row jsb">
				<div className={classNames.amountUsdContainer}>
					{state.isFocused && !selection.amount && balance ? (
						<h5 className={classNames.maxButton} onMouseDown={handleMaxButtonClick}>
							{loading ? <Loader variant="neutral" /> : `Max: ${formatedBalance}`}
						</h5>
					) : !state.isFocused && selection.amount === '' ? (
						<h5>{t('tokenArea.enterAmount')}</h5>
					) : (
						<h5>{`$${numberToFormatString((selection.token.priceUsd ?? 0) * Number(selection.amount), 2)}`}</h5>
					)}
				</div>
				{!!balance && (
					<h5 className={classNames.balance}>
						{loading ? (
							<Loader variant="neutral" />
						) : (
							`Balance: ${formatedBalance} ${selection.token.symbol}`
						)}
					</h5>
				)}
			</div>
		)
	} else {
		return (
			<div className={classNames.amountUsdContainer}>
				<h5>{`$${numberToFormatString((selection.token.priceUsd ?? 0) * Number(selection.amount), 2)}`}</h5>
			</div>
		)
	}
}
