import { useCallback, useMemo } from 'react'
import { textToAmount } from '../utils/new/input'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'

export const useTextInputValidator = (text: string, token: ExtendedToken | null) => {
	const { setError } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''

	const validation = useMemo(() => {
		if (!text.trim()) {
			return { valid: false, errorMessage: null }
		}

		if (!/^[a-z]+$/i.test(text)) {
			return {
				valid: false,
				errorMessage: 'Text commands must contain only letters',
			}
		}

		if (parseFloat(balance) === 0) {
			return {
				valid: false,
				errorMessage: `You don't have any ${symbol}`,
			}
		}

		const amount = textToAmount(text, Number(balance))
		if (!amount) {
			return {
				valid: false,
				errorMessage: `Unknown command: "${text}"`,
			}
		}

		return { valid: true, amount, errorMessage: null }
	}, [text, balance, symbol])

	return useCallback(() => {
		setError(validation.errorMessage)
	}, [validation.errorMessage, setError])
}
