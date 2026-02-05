import type { FC } from 'react'
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
	isHighlighted?: boolean
	prefix?: string
	suffix?: string
	tooltip?: TooltipConfig
}

export const Info: FC<InfoProps> = ({
	value,
	label,
	isLoading,
	isHighlighted = false,
	prefix,
	suffix,
	tooltip,
}) => {
	if (isLoading) {
		return (
			<div className="pool_compact_info">
				<SkeletonLoader width="100%" height={36} />
			</div>
		)
	}

	return (
		<div
			className={`pool_compact_info ${isHighlighted ? 'pool_compact_info--highlighted' : ''}`}
		>
			<div className="pool_compact_info_value">
				{prefix && (
					<span
						className={`pool_compact_info_value_symbol_left ${isHighlighted ? 'pool_compact_info_value_symbol_left_highlighted' : ''}`}
					>
						{prefix}
					</span>
				)}
				<span
					className={`pool_compact_info_value_number ${isHighlighted ? 'pool_compact_info_value_number_highlighted' : ''}`}
				>
					{value}
				</span>
				{suffix && (
					<span className="pool_compact_info_value_symbol_right">{suffix}</span>
				)}
			</div>
			<div className="pool_compact_info_description">
				<span className="pool_compact_info_label">{label}</span>
				{tooltip?.show && (
					<InfoTip
						id={`${label}_chart_info_tip`}
						description={tooltip.description}
						alignment="left"
					/>
				)}
			</div>
		</div>
	)
}
