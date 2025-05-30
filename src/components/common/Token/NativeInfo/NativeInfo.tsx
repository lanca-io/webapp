import { memo } from 'react'
import { Tag } from '@concero/ui-kit'
import { Tooltip } from '../../Tooltip/Tooltip'
import { InfoIcon } from '../../../../assets/icons/InfoIcon'
import './NativeInfo.pcss'

type NativeTokenBadgeProps = {
	isVisible: boolean
}

export const NativeInfo = memo(({ isVisible }: NativeTokenBadgeProps): JSX.Element | null => {
	if (!isVisible) return null

	return (
		<div className="native_info">
			<Tag className="token_chain" size="s" variant="neutral">
				Gas
			</Tag>
			<Tooltip
				place="bottom"
				className="native_info_tooltip"
				tooltipId="destination_value_tooltip"
				tooltipContent={
					<span className="native_info_text">
						Gas is the network’s native token used to pay fees for performing operations
					</span>
				}
			>
				<div className="info_icon_wrapper">
					<InfoIcon color="#66767d" />
				</div>
			</Tooltip>
		</div>
	)
})
