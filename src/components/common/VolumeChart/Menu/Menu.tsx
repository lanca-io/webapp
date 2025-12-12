import type { FC } from 'react'
import { IconButton } from '@concero/ui-kit'
import { VolumeRange } from '../types'
import './Menu.pcss'

export const RANGE_OPTIONS: { label: string; value: VolumeRange }[] = [
	{ label: 'M', value: VolumeRange.ONE_MONTH },
	{ label: '3M', value: VolumeRange.THREE_MONTHS },
	{ label: 'All', value: VolumeRange.ALL },
]

type MenuProps = {
	currentRange: VolumeRange
	onRangeChange: (range: VolumeRange) => void
}

export const Menu: FC<MenuProps> = ({
	currentRange,
	onRangeChange,
}): JSX.Element => {
	return (
		<div className="volume_chart_menu">
			{RANGE_OPTIONS.map(option => (
				<IconButton
					key={option.value}
					variant={currentRange === option.value ? 'secondary' : 'tetrary'}
					size="s"
					onClick={() => onRangeChange(option.value)}
					className="volume_chart_menu_option"
				>
					{option.label}
				</IconButton>
			))}
		</div>
	)
}
