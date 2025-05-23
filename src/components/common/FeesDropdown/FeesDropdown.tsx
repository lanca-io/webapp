import { memo } from 'react'
import { Tooltip } from '../Tooltip/Tooltip'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import { FeesContent } from './FeesContent/FeesContent'
import './FeesDropdown.pcss'

type FeesDropdownProps = {
	impact: number | null
	isPositive?: boolean
}

export const FeesDropdown = memo(({ impact, isPositive }: FeesDropdownProps) => {
	return (
		<Tooltip
			place="bottom"
			className="fee_dropdown"
			tooltipId="destination_value_tooltip"
			tooltipContent={<FeesContent impact={impact} isPositive={isPositive} />}
		>
			<InfoIcon color="#66767d" />
		</Tooltip>
	)
})
