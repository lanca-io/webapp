import type { FC } from 'react'
import { InfoIcon } from '@/assets/icons/InfoIcon'
import { Tooltip } from '../Tooltip/Tooltip'
import { useMemo } from 'react'
import './InfoTip.pcss'

type InfoTipProps = {
	id: string
	title: string
	description: string
}

export const InfoTip: FC<InfoTipProps> = ({
	id,
	title,
	description,
}): JSX.Element => {
	const content: JSX.Element = useMemo(
		() => (
			<div className="info_tooltip_content">
				<span className="info_tooltip_title">{title}</span>
				<span className="info_tooltip_description">{description}</span>
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
			place="bottom"
			className="info_tooltip"
		>
			{icon}
		</Tooltip>
	)
}
