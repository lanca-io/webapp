import classNames from './FeeDetailsDropdown.module.pcss'
import { TrailArrowDownIcon } from '../../../../../assets/icons/TrailArrowDownIcon'
import { InfoIcon } from '../../../../../assets/icons/InfoIcon'
import { useState } from 'react'
import { TooltipWrapper } from '../../../../wrappers/WithTooltip/TooltipWrapper'

interface FeePriceProps {
	title: string
	price: number
	percent: number
	infoTitle: string
}

interface Props {
	amountUsd: number
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
				<p className={`${classNames.priceFee} body2`}>{price.toFixed(6)}</p>
				<p className="body2">{percent.toFixed(1)} %</p>
			</div>
		</div>
	)
}

export const FeeDetailsDropdown = ({ amountUsd }: Props) => {
	const [isOpen, _] = useState(false)

	const feePrice = amountUsd

	return (
		<div className={classNames.wrap}>
			<div className={classNames.container}>
				<div className="row w-full jsb ac">
					<p className="body2">Included Fee</p>
					<p className={`${classNames.priceFee} body2`}>${feePrice.toFixed(6)}</p>
				</div>
				{/* <div className={classNames.iconWrap}> */}
				{/* 	<TrailArrowDownIcon /> */}
				{/* </div> */}
			</div>
			{isOpen && (
				<div className="gap-sm">
					<FeePrice
						infoTitle="For our cross-chain swaps, we leverage the Concero infrastructure, paying a fee of 0.1%
								of the transaction volume for its use."
						title="Concero fee"
						price={feePrice}
						percent={0.1}
					/>

					<FeePrice
						infoTitle="We utilize user-provided liquidity to facilitate cross-chain swaps, for which users are
								rewarded with fees"
						title="Concero LP fee"
						price={feePrice}
						percent={0.1}
					/>

					<FeePrice infoTitle="" title="Integrator fee" price={0} percent={0} />

					<FeePrice
						infoTitle="We leverage additional protocols to ensure fast and secure transactions, incurring fees
								for their use."
						title="Protocol services"
						price={feePrice}
						percent={0.1}
					/>
				</div>
			)}
		</div>
	)
}
