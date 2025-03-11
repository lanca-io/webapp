import type { FormFieldArray, FormFieldNames } from './types'
import { shallow } from 'zustand/shallow'
import { useFormStore } from './useFormStore'

export const useFieldValues = <T extends FormFieldNames[]>(...names: T) => {
	const values = useFormStore(store => names.map(name => store.userValues[name]?.value) as FormFieldArray<T>, shallow)

	return values
}
