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
	}: WidgetInputProps): JSX.Element => {
		const inputClass = value && value !== '0' ? 'input has_value' : 'input'

		return (
			<div className="widget_input_container">
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
