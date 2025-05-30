import type { FC, ChangeEvent } from 'react'
import type { TextInputProps } from './types'
import { forwardRef } from 'react'
import classNames from './TextInput.module.pcss'

export const TextInput: FC<TextInputProps> = forwardRef<HTMLInputElement, TextInputProps>(
	(
		{ value = '', placeholder, onChangeText, icon, isDisabled = false, title, type = 'text', className = '' },
		ref,
	) => {
		const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
			if (onChangeText) {
				onChangeText(event.target.value)
			}
		}

		return (
			<div className={`${className} ${classNames['input-wrapper']}`}>
				{title && <p className="body1">{title}</p>}
				<input
					ref={ref}
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					disabled={isDisabled}
					className={classNames['input']}
					aria-label={title || placeholder}
					aria-disabled={isDisabled}
				/>
				{icon}
			</div>
		)
	},
)
