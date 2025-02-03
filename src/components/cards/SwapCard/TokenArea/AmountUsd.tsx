import { useMemo } from 'react'
import { numberToFormatString } from '../../../../utils/formatting'
import { type Balance, type SwapStateDirection } from '../swapReducer/types'
import { useTranslation } from 'react-i18next'
import classNames from './TokenArea.module.pcss'
import { Loader } from '../../../layout/Loader/Loader'
import { type IRouteType } from 'lanca-sdk-demo'
import { format } from '../../../../utils/numberFormatting'

interface AmountUsdProps {
	direction: 'from' | 'to'
	isFocused: boolean
	userBalance: Balance | null
	selectedTokenInfo: SwapStateDirection
	selectedRoute: IRouteType | null
	handleMax: () => void
	loading: boolean
}

export function AmountUsd({
	isFocused,
	userBalance,
	selectedTokenInfo,
	direction,
	handleMax,
	loading,
	selectedRoute,
}: AmountUsdProps) {
	const { t } = useTranslation()

	const { formattedBalance, amountUsd, isAmountUsdNaN } = useMemo(() => {
		const balanceValue = format(Number(userBalance?.amount.rounded), 4)
		const amountUsdValue =
			direction === 'from'
				? numberToFormatString(
						Number(selectedRoute?.from.token.priceUsd ?? 0) *
							(Number(selectedRoute?.from.amount ?? 0) /
								10 ** Number(selectedRoute?.from.token.decimals)),
						2,
					)
				: numberToFormatString(
						Number(selectedRoute?.to.token.priceUsd ?? 0) *
							(Number(selectedRoute?.to.amount ?? 0) / 10 ** Number(selectedRoute?.to.token.decimals)),
						2,
					)
		return {
			formattedBalance: balanceValue,
			amountUsd: amountUsdValue,
			isAmountUsdNaN: isNaN(Number(amountUsdValue)),
		}
	}, [userBalance, selectedRoute, direction])

	const renderAmountUsdFrom = () => {
		if (isAmountUsdNaN) {
			return <Loader variant="neutral" />
		}
		if (direction !== 'from' && selectedRoute?.from.amount === undefined) {
			return <h5>$0</h5>
		}
		return <h5>{`$${amountUsd}`}</h5>
	}

	const renderAmountUsdTo = () => {
		if (direction !== 'from' && selectedRoute?.from.amount === undefined) {
			return <h5>$0</h5>
		}
		return <h5>{`$${amountUsd}`}</h5>
	}

	const renderMaxButton = () => (
		<h5 className={classNames.maxButton} onMouseDown={handleMax}>
			{loading ? <Loader variant="neutral" /> : `Max: ${formattedBalance}`}
		</h5>
	)

	const renderBalance = () => (
		<h5 className={classNames.balance}>
			{loading ? <Loader variant="neutral" /> : `Balance: ${formattedBalance} ${selectedTokenInfo.token.symbol}`}
		</h5>
	)

	return (
		<div className="row jsb">
			<div className={classNames.amountUsdContainer}>
				{direction === 'from' ? (
					<>
						{isFocused && !selectedTokenInfo.amount && userBalance ? (
							renderMaxButton()
						) : !isFocused && selectedTokenInfo.amount === '' ? (
							<h5>{t('tokenArea.enterAmount')}</h5>
						) : (
							renderAmountUsdFrom()
						)}
					</>
				) : (
					renderAmountUsdTo()
				)}
			</div>
			{direction === 'from' && !!userBalance && renderBalance()}
		</div>
	)
}
