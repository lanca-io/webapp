import classNames from './FeeDetailsDropdown.module.pcss'
import { TrailArrowDownIcon } from '../../../../../assets/icons/TrailArrowDownIcon'
import { InfoIcon } from '../../../../../assets/icons/InfoIcon'
import { useState } from 'react'
import { TooltipWrapper } from '../../../../wrappers/WithTooltip/TooltipWrapper'
import { type RouteData } from '../../../../../sdk/types/routeTypes'
import { Alert } from '../../../../layout/Alert/Alert'
import { numberToFormatString } from '../../../../../utils/formatting'

interface FeePriceProps {
	title: string
	price: number
	percent?: number
	infoTitle: string
}

interface Props {
	route: RouteData
}

const FeePrice = ({ title, price, percent, infoTitle }: FeePriceProps) => {
	return (
		<div className="row w-full jsb ac">
			<div className="row gap-sm ac">
				<p className="body2">{title}</p>

				<TooltipWrapper tooltipId={title} tooltipContent={<p>{infoTitle}</p>}>
					<InfoIcon />
				</TooltipWrapper>
			</div>
			<div className="row gap-xs ac">
				<p className={`${classNames.priceFee} body2`}>{price.toFixed(4)}</p>
				{percent && <p className="body2">{percent.toFixed(1)} %</p>}
			</div>
		</div>
	)
}

export const FeeDetailsDropdown = ({ route }: Props) => {
	const [isOpen, setIsOpen] = useState(false)

	const amountUsdFrom = route.from.amount ? Number(route.from.amount) * Number(route.from.token.priceUsd) : 0
	const amountUsdTo = route.to.amount ? Number(route.to.amount) * Number(route.to.token.priceUsd) : 0

	const totalFees = amountUsdFrom - amountUsdTo < 0 ? 0 : amountUsdFrom - amountUsdTo
	const priceImpact = (totalFees / amountUsdFrom) * 100
	const warningPriceImpact = priceImpact > 10 && totalFees > 5
	const dangerPriceImpact = priceImpact > 20

	// const isBridge = route.to.chain.id !== route.from.chain.id
	// const conceroFee = amountUsdFrom * 0.001
	// const protocolFee = totalFees === 0 ? 0 : totalFees - conceroFee

	return (
		<div className={classNames.wrap}>
			{warningPriceImpact && (
				<Alert
					subtitle={dangerPriceImpact ? 'Transaction not advised.' : ''}
					title={`High price impact (${priceImpact.toFixed(2)}%)`}
					variant={dangerPriceImpact ? 'error' : 'warning'}
				/>
			)}
			<div
				className={classNames.container}
				onClick={() => {
					setIsOpen(!isOpen)
				}}
			>
				<div className="row w-full jsb ac">
					<p className="body2">Price impact</p>
					<p className={`${classNames.priceFee} body2`}>${totalFees.toFixed(2)}</p>
				</div>
				<div className={classNames.iconWrap}>
					<TrailArrowDownIcon />
				</div>
			</div>
			{isOpen && (
				<div className={classNames.description}>
					<p>
						<span>Its include</span> Slippage, Concero services, <br /> Chainlink fee.
					</p>
				</div>
			)}
		</div>
	)
}
