import { memo } from 'react'
import './ModeButton.pcss'

type ModeButtonProps = {
	isActive: boolean
	onClick: () => void
	text: string
}

export const ModeButton = memo(
	({ isActive, onClick, text }: ModeButtonProps): JSX.Element => (
		<button
			className={`mode_button${isActive ? ' active' : ''}`}
			onClick={onClick}
			type="button"
			aria-pressed={isActive}
		>
			{text}
		</button>
	),
)
