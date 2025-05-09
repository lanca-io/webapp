import type { FC } from 'react'
import { useMemo } from 'react'
import { useRouteStore } from '../../store/route/useRouteStore'
import { useFormStore } from '../../store/form/useFormStore'
import { format } from '../../utils/new/format'
import { formatTokenAmount } from '../../utils/new/tokens'
import { tokenAmountToUsd } from '../../utils/new/input'
import './DestinationValueIndicator.pcss'

export const DestinationValueIndicator: FC = () => {
	const { route, isLoading } = useRouteStore()
	const { destinationToken } = useFormStore()

	const display = useMemo(() => {
		const rawAmount = route?.to?.amount
		const decimals = destinationToken?.decimals ?? 18
		const priceUsd = destinationToken?.priceUsd ?? 0

		if (!rawAmount || !priceUsd) return null

		const tokenAmount = Number(formatTokenAmount(rawAmount, decimals))
		if (!tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) return null

		const usdString = tokenAmountToUsd(tokenAmount, priceUsd)
		const usdValue = usdString ? Number(usdString) : null
		if (!usdValue || isNaN(usdValue) || usdValue <= 0) return null

		return format(usdValue, 2, '$')
	}, [route?.to?.amount, destinationToken?.decimals, destinationToken?.priceUsd])

	if (!display || isLoading) {
		return (
			<div className="dest_value_indicator">
				<span className="dest_value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div className="dest_value_indicator">
			<span className="dest_value_indicator_equal">=</span>
			<span className="dest_value_indicator_value">{display}</span>
		</div>
	)
}
