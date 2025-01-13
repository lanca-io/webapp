import classNames from './DropdownItems.module.pcss'
import { type ReactElement, useMemo } from 'react'

interface DropdownItemProps {
	isBridge: boolean
	isIntegrator: boolean
	fees: number
}

interface FeeItem {
	description: string
	percent: string
}

const feeItems: FeeItem[] = [
	{ description: 'Concero Fee', percent: '0.1 %' },
	{ description: 'Chainlink services', percent: '0.1 %' },
	{ description: 'Integrator Fee', percent: '0.1 %' },
	{ description: 'LP fee', percent: '0.1 %' },
]

const FeeItemComponent = ({ description, impact, percent }: FeeItem & { impact: string }): ReactElement => (
	<div className={classNames.item}>
		<p className={'body1'}>{description}</p>
		<div className={classNames.values}>
			<p className={`${classNames.impact} body1`}>{impact}</p>
			<p className={'body1'}>{percent}</p>
		</div>
	</div>
)

const filterFeeItems = (items: FeeItem[], isBridge: boolean, isIntegrator: boolean): FeeItem[] => {
	return items.filter(item => {
		if (!isBridge && item.description === 'LP fee') return false
		if (!isIntegrator && item.description === 'Integrator Fee') return false
		return true
	})
}

export const DropdownItems = ({ isBridge, isIntegrator, fees }: DropdownItemProps): ReactElement => {
	const filteredFeeItems = useMemo(() => filterFeeItems(feeItems, isBridge, isIntegrator), [isBridge, isIntegrator])
	const feeShare = useMemo(() => (fees / filteredFeeItems.length).toFixed(6), [fees, filteredFeeItems.length])

	return (
		<div className={classNames.container}>
			{filteredFeeItems.map((item, index) => (
				<FeeItemComponent
					key={index}
					description={item.description}
					impact={`-${feeShare}`}
					percent={item.percent}
				/>
			))}
		</div>
	)
}
