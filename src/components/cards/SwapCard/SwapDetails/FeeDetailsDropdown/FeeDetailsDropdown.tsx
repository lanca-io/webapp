import { useState, useEffect } from 'react'
import classNames from './FeeDetailsDropdown.module.pcss'
import { TrailArrowDownIcon } from '../../../../../assets/icons/TrailArrowDownIcon'
import { type Dispatch } from 'react'
import { type RouteData } from '../../../../../sdk/types/routeTypes'
import { Alert } from '../../../../layout/Alert/Alert'
import { type SwapAction } from '../../swapReducer/types'
import { getPriceImpact } from '../../txFunctions/getPriceImpact'

interface Props {
	route: RouteData
	swapDispatch: Dispatch<SwapAction>
}

export const formatValue = (value: number): string => {
	if (value === 0) {
		return '$0.00'
	} else if (value < 0.01) {
		return '< $0.01'
	} else {
		return `$${value.toFixed(2)}`
	}
}
export const FeeDetailsDropdown = ({ route }: Props) => {
	const [isOpen, setIsOpen] = useState(false)
	const [priceImpact, setPriceImpact] = useState(0)
	const [totalFees, setTotalFees] = useState(0)

	useEffect(() => {
		const { priceImpact, totalFees } = getPriceImpact({ from: route.from, to: route.to })
		setPriceImpact(priceImpact)
		setTotalFees(totalFees)
	}, [route.from, route.to.amount])

	const warningPriceImpact = priceImpact > 10 && totalFees > 5
	const dangerPriceImpact = priceImpact > 20

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
					<p className={`${classNames.priceFee} body2`}>{formatValue(totalFees)}</p>
				</div>
				<div className={classNames.iconWrap}>
					<TrailArrowDownIcon />
				</div>
			</div>
			{isOpen && (
				<div className={classNames.description}>
					<p>
						<span>It includes</span> Slippage, Concero fee, <br /> Chainlink services.
					</p>
				</div>
			)}
		</div>
	)
}
