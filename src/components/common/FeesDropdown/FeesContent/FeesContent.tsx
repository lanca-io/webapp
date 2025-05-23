import type { FC } from 'react'
import { useMemo } from 'react'
import { useRouteStore } from '../../../../store/route/useRouteStore'
import { format } from '../../../../utils/new/format'
import './FeesContent.pcss'

const feeMapping: Record<string, string> = {
	ConceroMessageFee: 'Concero Message Fee',
	LancaPoolRebalanceFee: 'Pool Rebalance Fee',
	LancaFee: 'Lanca Fee',
	LancaPoolLPFee: 'Lanca Pool LP Fee',
	Slippage: 'Slippage',
}

type FeesContentProps = {
	impact: number | null
	isPositive?: boolean
}

export const FeesContent: FC<FeesContentProps> = ({ impact, isPositive }) => {
	const { route } = useRouteStore()

	const fees = useMemo(() => {
		if (!route?.steps || !Array.isArray(route.steps)) {
			return []
		}

		const allFees: any[] = []

		route.steps.forEach(step => {
			if (step && 'fees' in step && Array.isArray((step as any).fees)) {
				const stepFees = (step as any).fees || []
				allFees.push(...stepFees)
			}
		})

		return allFees
	}, [route])

	const totalFeesUsd = useMemo(() => {
		return fees.reduce((total, fee) => {
			const feeAmount = Number(fee.amount) / 10 ** fee.token.decimals
			const feeUsd = feeAmount * Number(fee.token.priceUsd)
			return total + feeUsd
		}, 0)
	}, [fees])

	const slippage = useMemo(() => {
		if (impact === null) return 0
		const absoluteImpact = Math.abs(impact)
		if (isPositive && totalFeesUsd < absoluteImpact) {
			return absoluteImpact - totalFeesUsd
		}
		return totalFeesUsd - absoluteImpact
	}, [impact, totalFeesUsd, isPositive])

	return (
		<div className="fees_content">
			<span className={`fees_content_heading ${isPositive ? 'positive' : 'negative'}`}>Price Impact</span>
			<div className="fees_content_items">
				{impact !== null && slippage !== 0 && (
					<div className="fees_content_item">
						<div className="fees_content_item">
							{`Slippage (${isPositive ? '+' : '-'}${format(Math.abs(slippage), 2, '$')})`}
						</div>
					</div>
				)}
				{fees.length > 0 ? (
					fees.map((fee, index) => {
						const feeName = feeMapping[fee.type] || fee.type
						const feeAmount = Number(fee.amount) / 10 ** fee.token.decimals
						const feeUsd = feeAmount * Number(fee.token.priceUsd)

						return (
							<div key={index} className="fees_content_item">
								<div className="fees_content_item">{`${feeName} (-${format(feeUsd, 2, '$')})`}</div>
							</div>
						)
					})
				) : (
					<div className="fees_content_item">No fee breakdown available</div>
				)}
			</div>
		</div>
	)
}
