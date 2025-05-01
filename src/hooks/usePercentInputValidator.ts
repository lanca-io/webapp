import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'

export const usePercentInputValidator = (value: string) => {
	const { setError } = useFormStore()

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null }
		}
		const cleanValue = value.replace('%', '')
		const percentage = parseFloat(cleanValue)

		if (isNaN(percentage)) {
			return {
				valid: false,
				errorMessage: 'Please enter a valid number',
			}
		}

		if (percentage < 0) {
			return {
				valid: false,
				errorMessage: 'Percentage cannot be negative',
			}
		}

		if (percentage > 100) {
			return {
				valid: false,
				errorMessage: 'Percentage cannot exceed 100%',
			}
		}

		return {
			valid: true,
			value: percentage,
			errorMessage: null,
		}
	}, [value])

	return useCallback(() => {
		setError(validation.errorMessage)
	}, [validation.errorMessage, setError])
}
