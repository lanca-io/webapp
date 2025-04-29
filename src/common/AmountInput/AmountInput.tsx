import type { FC, ChangeEvent, FocusEvent } from 'react'
import { useMemo } from 'react'
import './AmountInput.pcss'

type AmountInputProps = {
	value: string
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	onFocus?: (e: FocusEvent<HTMLInputElement>) => void
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void
	placeholder?: string
	disabled?: boolean
}

export const AmountInput: FC<AmountInputProps> = ({
	value,
	onChange,
	onFocus,
	onBlur,
	placeholder = '0',
	disabled = false,
}) => {
	const inputClass = useMemo(() => {
		return value && value !== '0' ? 'input has_value' : 'input'
	}, [value])

	return (
		<div className="input_container">
			<input
				type="text"
				className={inputClass}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onFocus={onFocus}
				onBlur={onBlur}
				disabled={disabled}
				aria-label="Amount input"
				autoComplete="off"
			/>
		</div>
	)
}
