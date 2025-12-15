import type { FC } from 'react'
import { IconButton } from '@concero/ui-kit'
import './ChartMenu.pcss'

export enum ChartRange {
	ONE_MONTH = '1M',
	THREE_MONTHS = '3M',
	ALL = 'ALL',
}

type MenuProps = {
	range: ChartRange
	onChange: (range: ChartRange) => void
}

export const ChartMenu: FC<MenuProps> = ({ range, onChange }) => {
	const options = [
		ChartRange.ONE_MONTH,
		ChartRange.THREE_MONTHS,
		ChartRange.ALL,
	]

	return (
		<div className="chart_menu">
			{options.map(value => (
				<IconButton
					key={value}
					variant={range === value ? 'secondary' : 'tetrary'}
					size="s"
					onClick={() => onChange(value)}
					className="chart_menu_option"
				>
					{value}
				</IconButton>
			))}
		</div>
	)
}
