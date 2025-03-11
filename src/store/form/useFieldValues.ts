import type { FormFieldArray, FormFieldNames } from './types'
import { shallow } from 'zustand/shallow'
import { useFormStore } from './useFormStore'

export const useFieldValues = <T extends FormFieldNames[]>(...names: T): FormFieldArray<T> => {
	return useFormStore(store => names.map(name => store.userValues[name]?.value) as FormFieldArray<T>, shallow)
}
