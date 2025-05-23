import { memo, useMemo } from 'react'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { useFormStore } from '../../../store/form/useFormStore'
import { format } from '../../../utils/new/format'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { tokenAmountToUsd } from '../../../utils/new/input'
import { preciseSubtract } from '../../../utils/new/operations'
import { FeesDropdown } from '../FeesDropdown/FeesDropdown'
import './DestinationValue.pcss'

export const DestinationValue = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { fromToken, toToken, fromAmount } = useFormStore()

	const isReady =
		fromAmount &&
		route?.to?.amount &&
		fromToken?.priceUsd &&
		toToken?.priceUsd &&
		fromToken?.decimals !== undefined &&
		toToken?.decimals !== undefined

	const { fromValueUsd, toValueUsd } = useMemo(() => {
		if (!isReady) return {}
		const fromDecimals = fromToken.decimals
		const toDecimals = toToken.decimals

		const formattedFrom = formatTokenAmount(fromAmount, fromDecimals)
		const formattedTo = formatTokenAmount(route.to.amount, toDecimals)

		if (!formattedFrom || !formattedTo) return {}

		const fromUsd = tokenAmountToUsd(Number(formattedFrom), fromToken?.priceUsd || 0)
		const toUsd = tokenAmountToUsd(Number(formattedTo), toToken?.priceUsd || 0)

		return {
			formattedFromAmount: Number(formattedFrom),
			formattedToAmount: Number(formattedTo),
			fromValueUsd: Number(fromUsd),
			toValueUsd: Number(toUsd),
		}
	}, [
		isReady,
		fromAmount,
		route?.to?.amount,
		fromToken?.decimals,
		fromToken?.priceUsd,
		toToken?.decimals,
		toToken?.priceUsd,
	])

	const rawImpact = useMemo(() => {
		if (fromValueUsd === undefined || toValueUsd === undefined || isNaN(fromValueUsd) || isNaN(toValueUsd))
			return null

		const diff = preciseSubtract(toValueUsd, fromValueUsd)
		if (diff === 0) return null

		return diff
	}, [fromValueUsd, toValueUsd])

	const formattedImpact = useMemo(() => {
		if (rawImpact === null) return null

		const isPositive = rawImpact > 0
		const sign = isPositive ? '+' : '-'
		return {
			value: `${sign} ${format(Math.abs(rawImpact), 2, '$')}`,
			isPositive,
		}
	}, [rawImpact])

	const displayValue = useMemo(() => {
		if (toValueUsd === undefined || isNaN(toValueUsd) || toValueUsd <= 0) return null
		return format(toValueUsd, 2, '$')
	}, [toValueUsd])

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
			{formattedImpact && (
				<span
					className={`dest_value_indicator_impact ${formattedImpact.isPositive ? 'positive' : 'negative'}`}
					aria-label={`Price impact: ${formattedImpact.isPositive ? 'positive' : 'negative'}`}
				>
					({formattedImpact.value})
				</span>
			)}
			<FeesDropdown impact={rawImpact} isPositive={formattedImpact?.isPositive} />
		</div>
	)
})
