import { createWithEqualityFn } from 'zustand/traditional'
import type {
	DefaultValues,
	FormFieldArray,
	FormFieldNames,
	FormValueControl,
	FormValues,
	FormValuesState,
	ValidationFunction,
	SetOptions,
} from './types'

export const formDefaultValues: DefaultValues = {
	toChain: '137',
	fromChain: '10',
	fromAmount: '0',
	toAmount: '0',
	fromToken: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
	toToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
}

const defaultValueToFormValue = <T>(value: T): FormValueControl<T> => ({
	isTouched: false,
	isDirty: false,
	value,
})

const valuesToFormValues = (defaultValues: DefaultValues): FormValues => {
	return Object.keys(defaultValues).reduce<FormValues>((accum, key) => {
		accum[key as FormFieldNames] = defaultValueToFormValue(defaultValues[key as keyof DefaultValues]) as never
		return accum
	}, {} as FormValues)
}

const isString = (str: any): str is string => typeof str === 'string' || str instanceof String

const getUpdatedTouchedFields = (userValues: FormValues): Partial<Record<FormFieldNames, boolean>> => {
	return Object.keys(userValues).reduce<Partial<Record<FormFieldNames, boolean>>>((accum, key) => {
		if (userValues[key as FormFieldNames]?.isTouched) {
			accum[key as FormFieldNames] = true
		}
		return accum
	}, {})
}

const mergeDefaultFormValues = (userValues: FormValues, defaultValues: FormValues): FormValues => {
	return Object.keys(defaultValues).reduce<FormValues>(
		(accum, key) => {
			const formValue = {
				isTouched: !!(
					userValues[key as FormFieldNames]?.isTouched || defaultValues[key as FormFieldNames]?.isTouched
				),
				isDirty: !!(
					userValues[key as FormFieldNames]?.isDirty || defaultValues[key as FormFieldNames]?.isTouched
				),
				value:
					userValues[key as FormFieldNames]?.value ||
					Number.isFinite(userValues[key as FormFieldNames]?.value)
						? userValues[key as FormFieldNames]?.value
						: defaultValues[key as FormFieldNames]?.value,
			}
			accum[key as FormFieldNames] = formValue as never
			return accum
		},
		{ ...valuesToFormValues(formDefaultValues) },
	)
}

export const createFormStore = (defaultValues?: DefaultValues) =>
	createWithEqualityFn<FormValuesState>((set, get) => {
		const _defaultValues = valuesToFormValues({
			...formDefaultValues,
			...defaultValues,
		})
		return {
			defaultValues: _defaultValues,
			userValues: _defaultValues,
			touchedFields: {},
			isValid: true,
			isValidating: false,
			errors: {},
			validation: {},
			setDefaultValues: (defaultValue: DefaultValues) => {
				const defaultFormValues = valuesToFormValues(defaultValue)
				set(state => ({
					defaultValues: defaultFormValues,
					userValues: mergeDefaultFormValues(state.userValues, defaultFormValues),
				}))
			},
			setUserAndDefaultValues: (formValues: Partial<DefaultValues>) => {
				const currentUserValues = get().userValues
				Object.keys(formValues).forEach(key => {
					const fieldName = key as FormFieldNames
					if (formValues[fieldName] !== currentUserValues[fieldName]?.value) {
						get().resetField(fieldName, { defaultValue: formValues[fieldName] })
						get().setFieldValue(fieldName, formValues[fieldName], { isTouched: true })
					}
				})
			},
			isTouched: (fieldName: FormFieldNames) => !!get().userValues[fieldName]?.isTouched,
			isDirty: (fieldName: FormFieldNames) => !!get().userValues[fieldName]?.isDirty,
			setAsTouched: (fieldName: FormFieldNames) => {
				const userValues = {
					...get().userValues,
					[fieldName]: {
						...get().userValues[fieldName],
						isTouched: true,
					},
				}
				set({
					userValues,
					touchedFields: getUpdatedTouchedFields(userValues),
				})
			},
			resetField: (fieldName: FormFieldNames, { defaultValue }: { defaultValue?: any } = {}) => {
				const fieldValues = defaultValue
					? { ...get().defaultValues[fieldName], value: defaultValue }
					: get().defaultValues[fieldName]
				const defaultValues = {
					...get().defaultValues,
					[fieldName]: fieldValues,
				}
				const userValues = {
					...get().userValues,
					[fieldName]: fieldValues,
				}
				set({
					defaultValues,
					userValues,
					touchedFields: getUpdatedTouchedFields(userValues),
				})
			},
			setFieldValue: (fieldName: FormFieldNames, value: any, { isDirty, isTouched }: SetOptions = {}) => {
				const userValues = {
					...get().userValues,
					[fieldName]: {
						value,
						isDirty: isDirty ?? get().userValues[fieldName]?.isDirty,
						isTouched: isTouched ?? get().userValues[fieldName]?.isTouched,
					},
				}
				set({
					userValues,
					touchedFields: getUpdatedTouchedFields(userValues),
				})
			},
			getFieldValues: <T extends FormFieldNames[]>(...names: T) =>
				names.map(name => get().userValues[name]?.value) as FormFieldArray<T>,
			addFieldValidation: (name: FormFieldNames, validationFn: ValidationFunction) => {
				set(state => ({
					validation: {
						...state.validation,
						[name]: validationFn,
					},
				}))
			},
			triggerFieldValidation: async (name: FormFieldNames) => {
				try {
					let valid = true
					set({ isValid: false, isValidating: true })

					const validationFn = get().validation[name]

					if (validationFn) {
						const result = await validationFn(get().userValues[name]?.value)
						if (isString(result)) {
							valid = false
							set(state => ({
								errors: {
									...state.errors,
									[name]: result,
								},
							}))
						} else {
							valid = result as boolean
							if (valid) {
								get().clearErrors(name)
							}
						}
					}

					set({ isValid: valid, isValidating: false })
					return valid
				} catch (err) {
					set({ isValidating: false })
					throw err
				}
			},
			clearErrors: (name: FormFieldNames) => {
				const newErrors = { ...get().errors }
				delete newErrors[name]
				set({ errors: newErrors })
			},
		}
	}, Object.is)
