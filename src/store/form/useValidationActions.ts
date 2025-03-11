import type { ValidationActions } from './types'
import { shallow } from 'zustand/shallow'
import { useFormStore } from './useFormStore'

export const useValidationActions = () => {
	return useFormStore<ValidationActions>(
		store => ({
			addFieldValidation: store.addFieldValidation,
			triggerFieldValidation: store.triggerFieldValidation,
			clearErrors: store.clearErrors,
		}),
		shallow,
	)
}
