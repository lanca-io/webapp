import { useState, useCallback, ChangeEvent, FocusEvent } from 'react'

const sanitizeAddress = (input: string): string => {
	let sanitized = input.trim().toLowerCase()
	sanitized = sanitized.replace(/[^a-z0-9._-]/g, '')
	return sanitized
}

export const useAddressInputHandlers = () => {
	const [address, setAddress] = useState('')

	const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const sanitized = sanitizeAddress(e.target.value)
		setAddress(sanitized)
	}, [])

	const onFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
		console.log(e.target.placeholder)
	}, [])

	const onBlur = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			console.log(e.target.value)
			if (!address) setAddress('')
		},
		[address],
	)

	return {
		address,
		onChange,
		onFocus,
		onBlur,
	}
}
