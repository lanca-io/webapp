import { memo, ChangeEvent, FocusEvent } from 'react'
import './WidgetInput.pcss'

type WidgetInputProps = {
	value: string
	onChange?: (e: ChangeEvent<HTMLInputElement>) => void
	onFocus?: (e: FocusEvent<HTMLInputElement>) => void
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void
	placeholder?: string
	disabled?: boolean
	type?: string
	className?: string
}

export const WidgetInput = memo(
	({
		value,
		onChange,
		onFocus,
		onBlur,
		placeholder = '0',
		disabled = false,
		type = 'text',
		className = '',
	}: WidgetInputProps): JSX.Element => {
		const inputClass = value && value !== '0' ? 'input has_value' : 'input'
		const containerClass = `widget_input_container ${disabled ? 'disabled' : ''} ${className}`.trim()

		return (
			<div className={containerClass}>
				<input
					type={type}
					className={inputClass}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onFocus={onFocus}
					onBlur={onBlur}
					disabled={disabled}
					autoComplete="off"
				/>
			</div>
		)
	},
)
