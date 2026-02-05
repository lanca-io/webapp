import type { FC } from 'react'
import { useMemo } from 'react'
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
	const skeleton = useMemo(
		() => (
			<div className="pool_extended_info">
				<SkeletonLoader width="100%" height={38} />
			</div>
		),
		[],
	)

	const content = useMemo(
		() => (
			<div
				className={`pool_extended_info ${isHighlighted ? 'pool_extended_info--highlighted' : ''}`}
			>
				<div className="pool_extended_info_value">
					{prefix && (
						<span
							className={`pool_extended_info_value_symbol_left ${isHighlighted ? 'pool_extended_info_value_symbol_left_highlighted' : ''}`}
						>
							{prefix}
						</span>
					)}
					<span
						className={`pool_extended_info_value_number ${isHighlighted ? 'pool_extended_info_value_number_highlighted' : ''}`}
					>
						{value}
					</span>
					{suffix && (
						<span className="pool_extended_info_value_symbol_right">
							{suffix}
						</span>
					)}
				</div>
				<div className="pool_extended_info_description">
					<span className="pool_extended_info_label">{label}</span>
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
		[value, label, prefix, suffix, tooltip, isHighlighted],
	)

	return isLoading ? skeleton : content
}
