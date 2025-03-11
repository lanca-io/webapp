import type {
	DefaultValues,
	FormActions,
	FormFieldNames,
	GenericFormValue,
	SetOptions,
	FormFieldChanged,
} from './types'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useEvents } from '../../hooks/useEvents'
import { useFormStore } from './useFormStore'
import { Event } from '../../types/events'

export const useFieldActions = () => {
	const emitter = useEvents()
	const actions = useFormStore<FormActions>(
		store => ({
			getFieldValues: store.getFieldValues,
			isTouched: store.isTouched,
			isDirty: store.isDirty,
			resetField: store.resetField,
			setAsTouched: store.setAsTouched,
			setDefaultValues: store.setDefaultValues,
			setFieldValue: store.setFieldValue,
			setUserAndDefaultValues: store.setUserAndDefaultValues,
			addFieldValidation: store.addFieldValidation,
			triggerFieldValidation: store.triggerFieldValidation,
			clearErrors: store.clearErrors,
		}),
		shallow,
	)

	const emitFieldChangedEvent = (
		fieldName: FormFieldNames,
		newValue: GenericFormValue,
		oldValue: GenericFormValue,
	) => {
		emitter.emit(Event.FormFieldChanged, {
			fieldName,
			newValue,
			oldValue,
		} as FormFieldChanged)
	}

	const setFieldValueWithEmittedEvents = useCallback(
		(fieldName: FormFieldNames, newValue: GenericFormValue, options?: SetOptions) => {
			const oldValue = actions.getFieldValues(fieldName)[0]

			actions.setFieldValue(fieldName, newValue, options)

			if (newValue !== oldValue) {
				emitFieldChangedEvent(fieldName, newValue, oldValue)
			}
		},
		[actions, emitter],
	)

	const setUserAndDefaultValuesWithEmittedEvents = useCallback(
		(formValues: Partial<DefaultValues>) => {
			const formValuesKeys = Object.keys(formValues) as FormFieldNames[]

			const changedValues = formValuesKeys.reduce<
				Array<{
					fieldName: FormFieldNames
					newValue: GenericFormValue
					oldValue: GenericFormValue
				}>
			>((accum, fieldName) => {
				const oldValue = actions.getFieldValues(fieldName)[0]
				const newValue = formValues[fieldName]

				if (newValue !== oldValue) {
					accum.push({ fieldName, newValue, oldValue })
				}

				return accum
			}, [])

			actions.setUserAndDefaultValues(formValues)

			changedValues.forEach(({ fieldName, newValue, oldValue }) => {
				emitFieldChangedEvent(fieldName, newValue, oldValue)
			})
		},
		[actions, emitter],
	)

	return {
		...actions,
		setFieldValue: setFieldValueWithEmittedEvents,
		setUserAndDefaultValues: setUserAndDefaultValuesWithEmittedEvents,
	}
}
