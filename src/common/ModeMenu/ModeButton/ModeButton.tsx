import { FC, memo } from 'react'
import './ModeButton.pcss'

type ModeProps = {
	isActive: boolean
	onClick: () => void
	text: string
}

export const ModeButton: FC<ModeProps> = memo(({ isActive, onClick, text }) => (
	<button className={`mode_button ${isActive ? 'active' : ''}`} onClick={onClick}>
		{text}
	</button>
))
