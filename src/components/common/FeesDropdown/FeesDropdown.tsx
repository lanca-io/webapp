import { memo, useMemo } from 'react'
import { Tooltip } from '../Tooltip/Tooltip'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import { FeesContent, ImpactSeverity } from './FeesContent/FeesContent'
import './FeesDropdown.pcss'

type FeesDropdownProps = {
	severity: ImpactSeverity
}

export const FeesDropdown = memo(({ severity }: FeesDropdownProps) => {
	const tooltipContent = useMemo(() => <FeesContent severity={severity} />, [severity])

	return (
		<Tooltip
			place="bottom"
			className="fee_dropdown"
			tooltipId="destination_value_tooltip"
			tooltipContent={tooltipContent}
		>
			<InfoIcon color="#66767d" />
		</Tooltip>
	)
})
