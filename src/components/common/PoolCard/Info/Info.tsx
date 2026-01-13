import type { FC, ReactNode } from 'react'
import { memo } from 'react'
import { SkeletonLoader } from '../../SkeletonLoader'
import { InfoTip } from '../../InfoTip'
import './Info.pcss'

type TooltipConfig = {
	description: string
	show: boolean
}

type InfoProps = {
	value: number | string
	label: string
	isLoading: boolean
	symbolLeft?: string
	symbolRight?: string
	tooltip?: TooltipConfig
	children?: ReactNode
}

export const Info: FC<InfoProps> = memo(
	({ value, label, isLoading, symbolLeft, symbolRight, tooltip }) =>
		isLoading ? (
			<div className="pool_card_info">
				<SkeletonLoader width={'100%'} height={36} />
			</div>
		) : (
			<div className="pool_card_info">
				<div className="pool_card_info_value">
					{symbolLeft && (
						<span className="pool_card_info_value_symbol_left">
							{symbolLeft}
						</span>
					)}
					<span className="pool_card_info_value_number">{value}</span>
					{symbolRight && (
						<span className="pool_card_info_value_symbol_right">
							{symbolRight}
						</span>
					)}
				</div>
				<div className="pool_card_info_description">
					<span className="pool_card_info_label">{label}</span>
					{tooltip?.show && (
						<InfoTip
							id={`${label}_chart_info_tip`}
							description={tooltip.description}
							alignment="left"
						/>
					)}
				</div>
			</div>
		),
)
