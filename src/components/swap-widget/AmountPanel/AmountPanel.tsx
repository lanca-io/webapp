import type { FC, ChangeEvent } from 'react'
import { useState, useRef, useEffect } from 'react'
import classNames from './AmountPanel.module.pcss'
import { ExtendedToken } from '../../../store/tokens/types'
import { useAccount } from 'wagmi'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { format } from '../../../utils/new/format'

interface AmountPanelProps {
	token: ExtendedToken | null
	disabled?: boolean
}

export const AmountPanel: FC<AmountPanelProps> = ({ token, disabled }) => {
	const { address } = useAccount()
	const [value, setValue] = useState<string>('')
	const [placeholder, setPlaceholder] = useState<string>('0')
	const [errorMessage, setErrorMessage] = useState<string>('')
	const [formattedValue, setFormattedValue] = useState<string>('Enter amount')
	const ref = useRef<HTMLInputElement>(null)
	const price = token?.priceUsd
	const decimals = token?.decimals || 18
	const balance = parseFloat(formatTokenAmount(token?.balance, decimals) || '0')

	useEffect(() => {
		const amount = parseFloat(value)
		if (isNaN(amount) || !price) {
			setFormattedValue('Enter amount')
		} else if (amount > balance) {
			setErrorMessage(`Not enough ${token?.symbol}`)
			setFormattedValue('')
		} else {
			setErrorMessage('')
			setFormattedValue(`= $${format(amount * price, 3)}`)
		}
	}, [value, price, balance, token?.symbol])

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target
		const formattedValue = formatInputAmount(value)
		setValue(formattedValue)
		setErrorMessage('')
		if (parseFloat(formattedValue) === 0) {
			setFormattedValue('Enter amount')
		} else if (parseFloat(formattedValue) <= balance) {
			setFormattedValue(`= $${format(parseFloat(formattedValue) * price, 3)}`)
		}
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

	const handleMaxClick = () => {
		setValue(balance.toString())
		setErrorMessage('')
		setFormattedValue(`= $${format(balance * price, 3)}`)
	}

	const formatInputAmount = (value: string): string => {
		return value.replace(/[^0-9.]/g, '')
	}

	return (
		<div className={classNames['amount-panel']}>
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
				{!errorMessage && <div className={classNames['enter-amount']}>{formattedValue}</div>}
				{errorMessage && <div className={classNames['error-message']}>{errorMessage}</div>}
			</div>
			{address && balance > 0 && (
				<div className={classNames['balance-container']}>
					<span className={classNames['balance-title']}>Balance</span>
					<span className={classNames['balance-value']}>{format(balance, 4)}</span>
					<span className={classNames['balance-symbol']}>{token?.symbol}</span>
					<button onClick={handleMaxClick} className={classNames['max-button']}>
						Max
					</button>
				</div>
			)}
		</div>
	)
}
