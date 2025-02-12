import { useState, useCallback } from 'react'
import { TrailArrowDownIcon } from '../../../../../assets/icons/TrailArrowDownIcon'
import { Alert } from '../../../../layout/Alert/Alert'
import { getPriceImpact } from './getPriceImpact'
import { type IRouteType } from '@lanca/sdk'
import { DropdownItems } from './DropdownItem/DropdownItems'
import { format } from '../../../../../utils/numberFormatting'

import classNames from './FeeDropdown.module.pcss'

interface FeeDropdownProps {
	route: IRouteType
}

export const FeeDropdown = ({ route }: FeeDropdownProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)

	const { priceImpact, totalFees } = getPriceImpact(route)

	const warningPriceImpact = priceImpact > 10 && totalFees > 5
	const dangerPriceImpact = priceImpact > 20

	const handleToggle = useCallback(() => {
		setIsOpen(prevState => !prevState)
	}, [])

	return (
		<div className={classNames.wrap}>
			{priceImpact > 0 && warningPriceImpact && (
				<Alert
					subtitle={dangerPriceImpact ? 'Transaction not advised.' : ''}
					title={`High price impact (${priceImpact.toFixed(2)}%)`}
					variant={dangerPriceImpact ? 'error' : 'warning'}
				/>
			)}
			<div className={classNames.container} onClick={handleToggle}>
				<div className="row w-full jsb ac">
					<p className={`body4 ${classNames.priceImpact}`}>Total Fees</p>
					<p className={`${classNames.priceFee} body4`}>{`${format(totalFees, 2, '$')}`}</p>
				</div>
				<div className={`${classNames.iconWrap} ${isOpen ? classNames.iconOpen : ''}`}>
					<TrailArrowDownIcon />
				</div>
			</div>
			{isOpen && (
				<div className={classNames.description}>
					<DropdownItems
						from={route.from}
						fees={route.steps.flatMap(step => ('fees' in step ? step.fees : []))}
						totalFees={totalFees}
					/>
				</div>
			)}
		</div>
	)
}
