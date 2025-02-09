import { useState, useMemo, useCallback } from 'react'
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
	const { steps, to, from } = route

	const fees = useMemo(() => {
		return steps.flatMap(step => ('fees' in step ? step.fees : []))
	}, [steps])

	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { priceImpact, totalFees } = useMemo(() => getPriceImpact({ from, fees }), [from, to, fees])

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
					<p className={`${classNames.priceFee} body4`}>{`${format(totalFees, 2, '$')}`}</p>
				</div>
				<div className={classNames.iconWrap}>
					<TrailArrowDownIcon />
				</div>
			</div>
			{isOpen && (
				<div className={classNames.description}>
					<DropdownItems from={from} fees={fees} totalFees={totalFees} />
				</div>
			)}
		</div>
	)
}
