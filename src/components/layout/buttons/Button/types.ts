import { type MouseEventHandler, type ReactNode } from 'react'

export interface ButtonProps {
	size?: 'sm' | 'md' | 'lg'
	variant?: 'primary' | 'secondary' | 'secondaryColor' | 'tetrary' | 'tetraryColor'
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	onClick?: ((event: MouseEventHandler) => void) | undefined
	isLoading?: boolean
	isDisabled?: boolean
	className?: string
	children?: ReactNode
	isFull?: boolean
}
