import type { FC } from 'react'
import { RaceBy } from '@uiball/loaders'
import './FullScreenLoader.pcss'

export const FullScreenLoader: FC = () => {
	return (
		<div
			className="fullscreen_loader"
			style={{ backgroundColor: 'transparent' }}
		>
			<RaceBy color="var(--color-pacific-500)" />
		</div>
	)
}
