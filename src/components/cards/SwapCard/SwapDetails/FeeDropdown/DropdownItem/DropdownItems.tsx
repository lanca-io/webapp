import { TooltipWrapper } from '../../../../../wrappers/WithTooltip/TooltipWrapper'
import classNames from './DropdownItems.module.pcss'
import { type ReactElement, useMemo } from 'react'
import { InfoIcon } from '../../../../../../assets/icons/InfoIcon'

interface DropdownItemProps {
	isBridge: boolean
	isIntegrator: boolean
	fees: number
}

interface FeeItem {
	description: string
	percent: string
}

interface Props {
	title?: string
	description: string
	tooltipId: string
}

const InfoTooltip = ({ description, tooltipId }: Props) => {
	return (
		<TooltipWrapper
			place="top-start"
			className={classNames.tooltip}
			tooltipId={tooltipId}
			tooltipContent={
				<div className="gap-xs">
					<p className="body1">{description}</p>
				</div>
			}
		>
			<InfoIcon />
		</TooltipWrapper>
	)
}

const feeItems: FeeItem[] = [
	{ description: 'Slippage', percent: '0.5 %' },
	{ description: 'Concero Fee', percent: '0.1 %' },
	{ description: 'Chainlink services', percent: '0.1 %' },
	{ description: 'Integrator Fee', percent: '0.1 %' },
	{ description: 'LP fee', percent: '0.1 %' },
]

const FeeItemComponent = ({ description, impact, percent }: FeeItem & { impact: string }): ReactElement => (
	<div className={classNames.item}>
		<div className={classNames.descriptions}>
			<p className={'body1'}>{description}</p>
			<InfoTooltip
				description="The slippage is the difference between the expected price of a trade and the price at which the trade is executed."
				tooltipId={description}
			/>
		</div>

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
