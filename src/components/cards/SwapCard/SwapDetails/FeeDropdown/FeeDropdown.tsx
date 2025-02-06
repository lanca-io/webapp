import { useState, useMemo, useCallback } from 'react'
import { TrailArrowDownIcon } from '../../../../../assets/icons/TrailArrowDownIcon'
import { Alert } from '../../../../layout/Alert/Alert'
import { getPriceImpact } from './getPriceImpact'
import { type IRouteType } from '@lanca/sdk'
import classNames from './FeeDropdown.module.pcss'
import { DropdownItems } from './DropdownItem/DropdownItems'
import { StepType } from '@lanca/sdk'

interface FeeDropdownProps {
	route: IRouteType
}

export const formatValue = (value: number): string => {
	if (value === 0) {
		return '-0.00 USD'
	} else if (value < 0.01) {
		return '< -0.01 USD'
	} else {
		return `-${value.toFixed(2)} USD`
	}
}

export const FeeDropdown = ({ route: { from, to, steps } }: FeeDropdownProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { priceImpact, totalFees } = useMemo(() => getPriceImpact({ from, to }), [from, to])

	const isBridge = steps.some(step => step.type === StepType.BRIDGE)
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
					<p className="body4">Price impact</p>
					<p className={`${classNames.priceFee} body4`}>{formatValue(totalFees)}</p>
				</div>
				<div className={classNames.iconWrap}>
					<TrailArrowDownIcon />
				</div>
			</div>
			{isOpen && (
				<div className={classNames.description}>
					<DropdownItems isBridge={isBridge} isIntegrator={false} fees={totalFees} />
				</div>
			)}
		</div>
	)
}
