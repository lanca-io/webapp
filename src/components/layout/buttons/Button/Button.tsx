import { type FC } from 'react'
import { type ButtonProps } from './types'
import { Loader } from '../../Loader/Loader'
import { getButtonClasses } from './getButtonClasses'
import classNames from './Button.module.pcss'

interface ExtendedButtonProps extends ButtonProps {
	textColor?: string
}

export const Button: FC<ExtendedButtonProps> = ({
	size = 'md',
	variant = 'primary',
	leftIcon,
	rightIcon,
	isLoading,
	isDisabled,
	children,
	onClick,
	className,
	isFull,
	textColor,
}) => {
	const buttonClasses = getButtonClasses(size, variant, isLoading, isDisabled, isFull, className)

	return (
		<button
			className={buttonClasses}
			id={classNames[variant]}
			disabled={isDisabled}
			onClick={!isDisabled ? onClick : undefined}
			aria-label={variant + size}
			style={{ color: textColor }}
		>
			{!isLoading && leftIcon}
			<span className={classNames.innerButton}>{isLoading ? <Loader /> : children}</span>
			{!isLoading && rightIcon}
		</button>
	)
}
