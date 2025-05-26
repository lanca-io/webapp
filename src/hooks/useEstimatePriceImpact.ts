import { useMemo, useEffect } from 'react'
import { useRouteStore } from '../store/route/useRouteStore'
import { useFormStore } from '../store/form/useFormStore'
import { format } from '../utils/new/format'
import { formatTokenAmount } from '../utils/new/tokens'
import { tokenAmountToUsd } from '../utils/new/input'

export enum ImpactSeverity {
	POSITIVE = 'impact_positive',
	NORMAL = 'impact_normal',
	WARNING = 'impact_warning',
	DANGER = 'impact_danger',
}

export const useEstimatePriceImpact = () => {
	const { route, isLoading, setError, error } = useRouteStore()
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

	const { impact, severity } = useMemo(() => {
		if (!inUsd || !outUsd || Number(inUsd) === 0) return { impact: null, severity: null }

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
				severity =
					absImpact >= 50
						? ImpactSeverity.DANGER
						: absImpact >= 25
							? ImpactSeverity.WARNING
							: ImpactSeverity.NORMAL
			}
		}

		return {
			impact: {
				text: `${isGain ? '+ ' : '- '}${format(absImpact, 2, '')}%`,
				isGain,
			},
			severity,
		}
	}, [inUsd, outUsd])

	useEffect(() => {
		console.log(fromAmount)
		if (fromAmount && severity === ImpactSeverity.DANGER) {
			setError('Extreme price impact')
		}
	}, [severity, error, setError])

	const valueText = useMemo(() => {
		return outUsd ? format(Number(outUsd), 2, '$') : null
	}, [outUsd])

	return {
		isLoading,
		valueText,
		impact,
		severity,
		inUsd,
		outUsd,
	}
}
