import type { FC } from 'react'
import type { BurgerProps } from '../Burger/types'
import { IconButton } from '@concero/ui-kit'
import { IconBurger } from '@/assets/icons/IconBurger'
import { CloseIcon } from '@/assets/icons/CloseIcon'

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
