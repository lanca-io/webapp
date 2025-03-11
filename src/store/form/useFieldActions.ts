import type { FormFieldChanged } from './types'
import type { DefaultValues, FormActions, FormFieldNames, GenericFormValue, SetOptions } from './types.js'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useEvents } from '../../hooks/useEvents'
import { useFormStore } from './useFormStore.js'
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
		}),
		shallow,
	)

	const setFieldValueWithEmittedEvents = useCallback(
		(fieldName: FormFieldNames, newValue: GenericFormValue, options?: SetOptions) => {
			const oldValue = actions.getFieldValues(fieldName)[0]

			actions.setFieldValue(fieldName, newValue, options)

			if (newValue !== oldValue) {
				emitter.emit(Event.FormFieldChanged, {
					fieldName,
					newValue,
					oldValue,
				} as FormFieldChanged)
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
				emitter.emit(Event.FormFieldChanged, {
					fieldName,
					newValue,
					oldValue,
				} as FormFieldChanged)
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
