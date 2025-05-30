import { memo } from 'react'
import { Button } from '@concero/ui-kit'
import './ModeButton.pcss'

type ModeButtonProps = {
	isActive: boolean
	onClick: () => void
	text: string
}

export const ModeButton = memo(
	({ isActive, onClick, text }: ModeButtonProps): JSX.Element => (
		<Button
			className={`${!isActive ? 'inactive' : ''}`}
			variant="secondary_color"
			onClick={onClick}
			size="s"
			aria-pressed={isActive}
		>
			{text}
		</Button>
	),
)
