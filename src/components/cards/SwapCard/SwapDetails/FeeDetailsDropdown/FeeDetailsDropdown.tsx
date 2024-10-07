import classNames from './FeeDetailsDropdown.module.pcss'
import { TrailArrowDownIcon } from '../../../../../assets/icons/TrailArrowDownIcon'
import { InfoIcon } from '../../../../../assets/icons/InfoIcon'
import { useState } from 'react'

interface Props {
	title: string
	price: number
	percent: number
}

const FeePrice = ({ title, price, percent }: Props) => {
	return (
		<div className="row w-full jsb ac">
			<div className="row gap-sm ac">
				<p className="body2">{title}</p>
				<InfoIcon />
			</div>
			<div className="row gap-sm ac">
				<p className={`${classNames.priceFee} body2`}>{price}</p>
				<p className="body2">{percent} %</p>
			</div>
		</div>
	)
}

export const FeeDetailsDropdown = () => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<div className="gap-sm">
			<div
				className={classNames.container}
				onClick={() => {
					setIsOpen(!isOpen)
				}}
			>
				<div className="row w-full jsb ac">
					<p className="body2">Included Fee</p>
					<p className={`${classNames.priceFee} body2`}>$0.93</p>
				</div>
				<div className={classNames.iconWrap}>
					<TrailArrowDownIcon />
				</div>
			</div>
			{isOpen && (
				<div className="gap-sm">
					<FeePrice title="Concero fee" price={0.03} percent={0.1} />
					<FeePrice title="Concero LP fee" price={5.03} percent={0.1} />
					<FeePrice title="Integrator fee" price={0.0003} percent={0.1} />
					<FeePrice title="Chainlink services" price={2} percent={0.1} />
				</div>
			)}
		</div>
	)
}
