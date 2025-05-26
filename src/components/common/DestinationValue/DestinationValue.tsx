import { memo, useMemo } from 'react'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { useFormStore } from '../../../store/form/useFormStore'
import { format } from '../../../utils/new/format'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { tokenAmountToUsd } from '../../../utils/new/input'
import { FeesDropdown } from '../FeesDropdown/FeesDropdown'
import { ImpactSeverity } from '../FeesDropdown/FeesContent/FeesContent'
import './DestinationValue.pcss'

export const DestinationValue = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { fromToken, toToken, fromAmount } = useFormStore()

	const { inUsd, outUsd } = useMemo(() => {
		const ready = Boolean(
			fromAmount &&
				route?.to?.amount &&
				fromToken?.priceUsd &&
				toToken?.priceUsd &&
				typeof fromToken.decimals === 'number' &&
				typeof toToken.decimals === 'number',
		)

		if (!ready) return { inUsd: null, outUsd: null }

		const inAmount = formatTokenAmount(fromAmount, fromToken?.decimals || 18)
		const outAmount = formatTokenAmount(route?.to.amount, toToken?.decimals || 18)

		return {
			inUsd: tokenAmountToUsd(Number(inAmount), fromToken?.priceUsd || 0),
			outUsd: tokenAmountToUsd(Number(outAmount), toToken?.priceUsd || 0),
		}
	}, [fromAmount, route?.to?.amount, fromToken, toToken])

	const impact = useMemo(() => {
		if (!inUsd || !outUsd || Number(inUsd) === 0) return null

		const impactPct = ((Number(outUsd) - Number(inUsd)) / Number(inUsd)) * 100
		const isGain = impactPct > 0
		const absImpact = Math.abs(impactPct)

		let severity: ImpactSeverity = ImpactSeverity.NORMAL

		if (isGain) {
			severity = ImpactSeverity.POSITIVE
		} else {
			if (Number(inUsd) <= 10) {
				severity = ImpactSeverity.NORMAL
			} else {
				if (absImpact >= 50) {
					severity = ImpactSeverity.DANGER
				} else if (absImpact >= 25) {
					severity = ImpactSeverity.WARNING
				} else {
					severity = ImpactSeverity.NORMAL
				}
			}
		}

		return {
			text: `${isGain ? '+ ' : '- '}${format(absImpact, 2, '')}%`,
			isGain,
			severity,
		}
	}, [inUsd, outUsd])

	const valueText = useMemo(() => {
		return outUsd ? format(Number(outUsd), 2, '$') : null
	}, [outUsd])

	if (isLoading || !valueText) {
		return (
			<div className="dest_value_indicator" aria-hidden="true">
				<span className="dest_value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div className="dest_value_indicator">
			<span className="dest_value_indicator_equal">=</span>
			<span className="dest_value_indicator_value">{valueText}</span>
			{impact && <span className={`dest_value_indicator_impact ${impact.severity}`}>({impact.text})</span>}
			<FeesDropdown severity={impact?.severity || ImpactSeverity.NORMAL} />
		</div>
	)
})
