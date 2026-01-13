import type { FC } from 'react'
import { InfoIcon } from '@/assets/icons/InfoIcon'
import { Tooltip } from '../Tooltip/Tooltip'
import { useMemo } from 'react'
import './InfoTip.pcss'

type InfoTipProps = {
	id: string
	title?: string
	description: string
	alignment?: 'left' | 'center' | 'right'
	place?:
		| 'top'
		| 'top-start'
		| 'top-end'
		| 'right'
		| 'right-start'
		| 'right-end'
		| 'bottom'
		| 'bottom-start'
		| 'bottom-end'
		| 'left'
		| 'left-start'
		| 'left-end'
}

export const InfoTip: FC<InfoTipProps> = ({
	id,
	title,
	alignment = 'center',
	description,
	place,
}): JSX.Element => {
	const content: JSX.Element = useMemo(
		() => (
			<div className="info_tooltip_content">
				<span className="info_tooltip_title" style={{ textAlign: alignment }}>
					{title}
				</span>
				<span
					className="info_tooltip_description"
					style={{ textAlign: alignment }}
				>
					{description}
				</span>
			</div>
		),
		[title, description],
	)

	const icon: JSX.Element = useMemo(
		() => (
			<div className="info_tooltip_icon">
				<InfoIcon color="var(--color-gray-600)" />
			</div>
		),
		[],
	)

	return (
		<Tooltip
			tooltipId={id}
			tooltipContent={content}
			place={place}
			className="info_tooltip"
		>
			{icon}
		</Tooltip>
	)
}
