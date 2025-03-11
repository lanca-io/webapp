import type { ValidationProps } from './types'
import { shallow } from 'zustand/shallow'
import { useFormStore } from './useFormStore'

export const useValidation = (): Omit<ValidationProps, 'validation'> => {
	const [isValid, isValidating, errors] = useFormStore(
		store => [store.isValid, store.isValidating, store.errors],
		shallow,
	)

	return { isValid, isValidating, errors }
}
