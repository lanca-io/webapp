import type { FC } from 'react'
import { RaceBy } from '@uiball/loaders'
import './ScreenLoader.pcss'

export const ScreenLoader: FC = () => {
	return (
		<div
			className="fullscreen_loader"
			style={{ backgroundColor: 'transparent' }}
		>
			<RaceBy color="var(--color-pacific-500)" />
		</div>
	)
}
