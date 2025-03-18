import type { FC, ChangeEvent } from 'react'
import { useState, useRef } from 'react'
import classNames from './AmountInput.module.pcss'

interface AmountInputProps {
	disabled?: boolean
}

export const AmountInput: FC<AmountInputProps> = ({ disabled }) => {
	const [value, setValue] = useState<string>('')
	const [placeholder, setPlaceholder] = useState<string>('0')
	const ref = useRef<HTMLInputElement>(null)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target
		const formattedAmount = formatInputAmount(value)
		setValue(formattedAmount)
	}

	const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target
		const formattedAmount = formatInputAmount(value)
		setValue(formattedAmount)
		if (!formattedAmount) {
			setPlaceholder('0')
		}
	}

	const handleFocus = () => {
		setPlaceholder('')
	}

	return (
		<div className={classNames['amount-input-container']}>
			<div className={classNames['amount-input']}>
				<input
					ref={ref}
					type="text"
					className={classNames['input']}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onBlur={handleBlur}
					onFocus={handleFocus}
					disabled={disabled}
				/>
			</div>
			{!value && <div className={classNames['enter-amount']}>Enter amount</div>}
		</div>
	)
}

const formatInputAmount = (value: string): string => {
	return value.replace(/[^0-9.]/g, '')
}
