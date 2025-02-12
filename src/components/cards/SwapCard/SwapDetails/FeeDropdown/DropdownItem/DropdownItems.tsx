import { TooltipWrapper } from '../../../../../wrappers/WithTooltip/TooltipWrapper'
import classNames from './DropdownItems.module.pcss'
import { type ReactElement } from 'react'
import { InfoIcon } from '../../../../../../assets/icons/InfoIcon'
import { format } from '../../../../../../utils/numberFormatting'

interface DropdownItemProps {
	from: any
	fees: any[]
	totalFees: number
}

interface Props {
	title?: string
	description: string
	tooltipId: string
}

const InfoTooltip = ({ description, tooltipId }: Props) => {
	return (
		<TooltipWrapper
			place="top"
			className={classNames.tooltip}
			tooltipId={tooltipId}
			tooltipContent={
				<div className="gap-xs">
					<p className="body1">{description}</p>
				</div>
			}
		>
			<InfoIcon color="#66767d" />
		</TooltipWrapper>
	)
}

const FeeItemComponent = ({
	name,
	description,
	impact,
	index,
}: {
	name: string
	description: string
	impact: string
	index: number
}): ReactElement => (
	<div className={classNames.item}>
		<div className={classNames.descriptions}>
			<p className={`body1 ${classNames.description}`}>{name}</p>
			<InfoTooltip description={description} tooltipId={`fee-tooltip-${index}`} />
		</div>

		<div className={classNames.values}>
			<p className={`${classNames.impact} body1`}>{impact}</p>
		</div>
	</div>
)

const feeNameMapping: Record<string, { name: string; description: string }> = {
	ConceroMessageFee: {
		name: 'Concero Message Fee',
		description: 'Fee that Concero takes to maintain & improve cross-chain messaging.',
	},
	LancaPoolRebalanceFee: {
		name: 'Pool Rebalance Fee',
		description:
			'This fee maintains balanced liquidity across pools. It scales with transaction size—smaller swaps cost less due to batched operations and shared user costs.',
	},
	LancaFee: {
		name: 'Lanca Fee',
		description:
			'This fee is our platform’s service charge, empowering continuous innovation and the delivery of a robust, secure, and seamless cross-chain transaction experience.',
	},
	LancaPoolLPFee: {
		name: 'Lanca Pool LP Fee',
		description: 'We utilize user-provided liquidity for cross-chain swaps, for which LPs are rewarded with fees.',
	},
}

export const DropdownItems = ({ fees }: DropdownItemProps): ReactElement => {
	return (
		<div className={classNames.container}>
			{fees.map((item, index) => {
				const feeAmount = Number(item.amount) / 10 ** item.token.decimals
				const feeUsd = feeAmount * Number(item.token.priceUsd)
				const feeInfo = feeNameMapping[item.type] || {
					name: item.type,
					description: 'No description available.',
				}
				return (
					<FeeItemComponent
						key={index}
						name={feeInfo.name}
						description={feeInfo.description}
						impact={`${format(feeUsd, 2, '$')}`}
						index={index}
					/>
				)
			})}
		</div>
	)
}
