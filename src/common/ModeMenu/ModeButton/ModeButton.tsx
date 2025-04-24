import { FC, memo } from 'react'
import './ModeButton.pcss'

export type ModeButtonProps = {
	isActive: boolean
	onClick: () => void
	text: string
}

export const ModeButton: FC<ModeButtonProps> = memo(({ isActive, onClick, text }) => (
	<button className={`mode_button ${isActive ? 'active' : ''}`} onClick={onClick}>
		{text}
	</button>
))
