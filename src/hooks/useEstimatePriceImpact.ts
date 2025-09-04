import { useMemo, useEffect } from 'react'
import { useRouteStore } from '../store/route/useRouteStore'
import { useFormStore } from '../store/form/useFormStore'
import { format } from '../utils/new/format'
import { formatTokenAmount } from '../utils/new/tokens'
import { tokenAmountToUsd } from '../utils/new/input'
import { Decimal } from 'decimal.js'

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
				fromToken?.price_usd !== undefined &&
				toToken?.price_usd !== undefined &&
				typeof fromToken.decimals === 'number' &&
				typeof toToken.decimals === 'number',
		)

		if (!ready) return { inUsd: null, outUsd: null }

		const inAmount = formatTokenAmount(fromAmount, fromToken?.decimals ?? 18)
		const outAmount = formatTokenAmount(route?.to.amount, toToken?.decimals ?? 18)

		const inUsdVal = tokenAmountToUsd(new Decimal(inAmount), new Decimal(fromToken?.price_usd || 0))
		const outUsdVal = tokenAmountToUsd(new Decimal(outAmount), new Decimal(toToken?.price_usd || 0))

		return { inUsd: inUsdVal, outUsd: outUsdVal }
	}, [fromAmount, route?.to?.amount, fromToken, toToken])

	const { impact, severity } = useMemo(() => {
		if (!inUsd || !outUsd) return { impact: null, severity: null }

		const inUsdDec = new Decimal(inUsd)
		const outUsdDec = new Decimal(outUsd)

		if (inUsdDec.isZero()) return { impact: null, severity: null }

		const impactPct = outUsdDec.sub(inUsdDec).div(inUsdDec).mul(100)
		const isGain = impactPct.gt(0)
		const absImpact = impactPct.abs()
		const dollarDifference = outUsdDec.sub(inUsdDec).abs()
		const isSmallAmount = inUsdDec.lte(new Decimal(10))

		let severity: ImpactSeverity = ImpactSeverity.NORMAL

		if (isGain) {
			severity = ImpactSeverity.POSITIVE
		} else {
			if (isSmallAmount) {
				severity = ImpactSeverity.NORMAL
			} else {
				severity = absImpact.gte(50)
					? ImpactSeverity.DANGER
					: absImpact.gte(25)
						? ImpactSeverity.WARNING
						: ImpactSeverity.NORMAL
			}
		}

		const impactText = isSmallAmount
			? `${isGain ? '+ ' : '- '}${format(dollarDifference.toNumber(), 2, '$')}`
			: `${isGain ? '+ ' : '- '}${format(absImpact.toNumber(), 2, '')}%`

		return {
			impact: { text: impactText, isGain },
			severity,
		}
	}, [inUsd, outUsd])

	useEffect(() => {
		if (fromAmount && severity === ImpactSeverity.DANGER) {
			setError('Extreme price impact')
		}
	}, [severity, error, setError, fromAmount])

	const valueText = useMemo(() => {
		return outUsd ? format(new Decimal(outUsd).toNumber(), 2, '$') : null
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
