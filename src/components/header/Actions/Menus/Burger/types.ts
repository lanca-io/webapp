import type { TButtonSize, TButtonVariant } from '@concero/ui-kit'

export type BurgerProps = {
	isOpen: boolean
	onToggle: () => void
}

export type BurgerItemProps = {
	id: string
	label: string
	variant?: TButtonVariant
	size?: TButtonSize
	icons?: {
		left?: JSX.Element
		right?: JSX.Element
	}
	isFullWidth?: boolean
	onAction: () => void
}
