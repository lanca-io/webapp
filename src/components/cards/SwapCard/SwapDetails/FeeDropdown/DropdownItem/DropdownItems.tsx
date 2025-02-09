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
			<InfoIcon />
		</TooltipWrapper>
	)
}

const FeeItemComponent = ({ description, impact }: { description: string; impact: string }): ReactElement => (
	<div className={classNames.item}>
		<div className={classNames.descriptions}>
			<p className={'body1'}>{description}</p>
			<InfoTooltip
				description="The slippage is the difference between the expected price of a trade and the price at which the trade is executed."
				tooltipId={'fee-tooltip'}
			/>
		</div>

		<div className={classNames.values}>
			<p className={`${classNames.impact} body1`}>{impact}</p>
		</div>
	</div>
)

const feeNameMapping: Record<string, string> = {
	ConceroMessageFee: 'Concero Message Fee',
	LancaPoolRebalanceFee: 'Pool Rebalance Fee',
	LancaFee: 'Lanca Fee',
	LancaPoolLPFee: 'Lanca Pool LP Fee',
}

export const DropdownItems = ({ fees }: DropdownItemProps): ReactElement => {
	return (
		<div className={classNames.container}>
			{fees.map((item, index) => {
				const feeAmount = Number(item.amount) / 10 ** item.token.decimals
				const feeUsd = feeAmount * Number(item.token.priceUsd)
				const description = feeNameMapping[item.type] || item.type
				return <FeeItemComponent key={index} description={description} impact={`${format(feeUsd, 2, '$')}`} />
			})}
		</div>
	)
}
