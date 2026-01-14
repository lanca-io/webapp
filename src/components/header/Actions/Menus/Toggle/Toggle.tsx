import type { FC } from 'react'
import type { BurgerProps } from '../Burger/types'
import { IconButton } from '@concero/ui-kit'
import { IconBurger } from '@/assets/IconBurger'
import { CloseIcon } from '@/assets/CloseIcon'

export const Toggle: FC<BurgerProps> = ({ isOpen, onToggle }): JSX.Element => {
	const icon: JSX.Element = isOpen ? <CloseIcon /> : <IconBurger />

	return (
		<IconButton
			variant="secondary"
			onClick={onToggle}
			isFocused={isOpen}
			aria-pressed={isOpen}
		>
			{icon}
		</IconButton>
	)
}
