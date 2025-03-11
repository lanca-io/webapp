import { shallow } from 'zustand/shallow'
import { useFormStore } from './useFormStore'

export const useTouchedFields = () => {
	return useFormStore(store => store.touchedFields, shallow)
}
