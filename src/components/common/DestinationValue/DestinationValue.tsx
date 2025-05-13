import { memo, useMemo } from 'react'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { useFormStore } from '../../../store/form/useFormStore'
import { format } from '../../../utils/new/format'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { tokenAmountToUsd } from '../../../utils/new/input'
import './DestinationValue.pcss'

export const DestinationValue = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { destinationToken } = useFormStore()

	const displayValue = useMemo(() => {
		const rawAmount = route?.to?.amount
		const priceUsd = destinationToken?.priceUsd
		const decimals = destinationToken?.decimals ?? 18

		if (!rawAmount || !priceUsd) return null

		try {
			const tokenAmount = Number(formatTokenAmount(rawAmount, decimals))
			if (!tokenAmount || tokenAmount <= 0) return null

			const usdValue = tokenAmountToUsd(tokenAmount, priceUsd)
			if (!usdValue || Number(usdValue) <= 0) return null

			return format(Number(usdValue), 2, '$')
		} catch {
			return null
		}
	}, [route?.to?.amount, destinationToken?.decimals, destinationToken?.priceUsd])

	if (isLoading || !displayValue) {
		return (
			<div className="dest_value_indicator" aria-hidden="true">
				<span className="dest_value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div className="dest_value_indicator" role="status" aria-live="polite">
			<span className="dest_value_indicator_equal">=</span>
			<span className="dest_value_indicator_value" aria-label="Estimated value">
				{displayValue}
			</span>
		</div>
	)
})
