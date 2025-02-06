import { useState, useMemo, useCallback } from 'react'
import { TrailArrowDownIcon } from '../../../../../assets/icons/TrailArrowDownIcon'
import { Alert } from '../../../../layout/Alert/Alert'
import { getPriceImpact } from './getPriceImpact'
import { type IRouteType } from '@lanca/sdk'
import classNames from './FeeDropdown.module.pcss'

interface FeeDropdownProps {
	route: IRouteType
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

export const FeeDropdown = ({ route: { from, to } }: FeeDropdownProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { priceImpact, totalFees } = useMemo(() => getPriceImpact({ from, to }), [from, to])

	const warningPriceImpact = useMemo(() => priceImpact > 10 && totalFees > 5, [priceImpact, totalFees])
	const dangerPriceImpact = useMemo(() => priceImpact > 20, [priceImpact])

	const handleToggle = useCallback(() => {
		setIsOpen(prevState => !prevState)
	}, [])

	return (
		<div className={classNames.wrap}>
			{warningPriceImpact && (
				<Alert
					subtitle={dangerPriceImpact ? 'Transaction not advised.' : ''}
					title={`High price impact (${priceImpact.toFixed(2)}%)`}
					variant={dangerPriceImpact ? 'error' : 'warning'}
				/>
			)}
			<div className={classNames.container} onClick={handleToggle}>
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
