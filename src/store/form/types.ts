import type { MutableRefObject } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'

export interface DefaultValues {
	fromChain?: string
	toChain?: string
	fromToken?: string
	toToken?: string
	fromAmount: string
	toAmount: string
	toAddress?: string
}

export type GenericFormValue = string | number | undefined
export interface FormValueControl<T> {
	isTouched: boolean
	isDirty: boolean
	value: T
}

export type FormValues = {
	[Property in keyof DefaultValues]: FormValueControl<DefaultValues[Property]>
}

export type FormFieldNames = keyof FormValues
export type ExtractValueType<T> = T extends FormValueControl<infer U> ? U : never
export type FormFieldArray<T extends FormFieldNames[]> = {
	[K in keyof T]: ExtractValueType<FormValues[T[K]]>
}

export type TouchedFields = { [K in FormFieldNames]?: boolean }

type ValidationFn = (value: any) => Promise<boolean | string>
export interface ValidationProps {
	isValid: boolean
	isValidating: boolean
	errors: {
		[K in FormFieldNames]?: string
	}
	validation: {
		[K in FormFieldNames]?: ValidationFn
	}
}

export interface ValidationActions {
	addFieldValidation: (name: FormFieldNames, validationFn: ValidationFn) => void
	triggerFieldValidation: (name: FormFieldNames) => Promise<boolean>
	clearErrors: (name: FormFieldNames) => void
}

export interface FormProps {
	defaultValues: FormValues
	userValues: FormValues
	touchedFields: { [K in FormFieldNames]?: boolean }
}

export interface ResetOptions {
	defaultValue?: GenericFormValue
}

export type ValidationFunction = (value: any) => boolean | string | Promise<boolean | string>

export type FormActions = {
	getFieldValues: <T extends FormFieldNames[]>(...names: T) => FormFieldArray<T>
	isTouched: (fieldName: FormFieldNames) => boolean
	isDirty: (fieldName: FormFieldNames) => boolean
	resetField: (fieldName: FormFieldNames, options?: { defaultValue?: any }) => void
	setAsTouched: (fieldName: FormFieldNames) => void
	setDefaultValues: (defaultValues: DefaultValues) => void
	setFieldValue: (fieldName: FormFieldNames, value: any, options?: SetOptions) => void
	setUserAndDefaultValues: (formValues: Partial<DefaultValues>) => void
	addFieldValidation: (name: FormFieldNames, validationFn: ValidationFunction) => void
	triggerFieldValidation: (name: FormFieldNames) => Promise<boolean>
	clearErrors: (name: FormFieldNames) => void
}

export type FormValuesState = FormProps & FormActions & ValidationProps & ValidationActions

export type FormStoreStore = UseBoundStoreWithEqualityFn<StoreApi<FormValuesState>>

export type SetOptions = {
	isDirty?: boolean
	isTouched?: boolean
}

export type FormType = 'from' | 'to'

export interface FormTypeProps {
	formType: FormType
}

export const FormKeyHelper = {
	getChainKey: (formType: FormType): 'fromChain' | 'toChain' => `${formType}Chain`,
	getTokenKey: (formType: FormType): 'fromToken' | 'toToken' => `${formType}Token`,
	getAmountKey: (formType: FormType): 'fromAmount' | 'toAmount' => `${formType}Amount`,
}

export type FormFieldChanged = {
	[K in keyof DefaultValues]: {
		fieldName: K
		newValue: DefaultValues[K]
		oldValue: DefaultValues[K]
	}
}[keyof DefaultValues]

export interface FieldValues extends Omit<DefaultValues, 'fromAmount' | 'toAmount' | 'toAddress'> {
	fromAmount?: number | string
	toAmount?: number | string
	toAddress?: string
}

export type FieldNames = keyof FieldValues

export type SetFieldValueFunction = <K extends FieldNames>(key: K, value: FieldValues[K]) => void

export interface FormState {
	setFieldValue: SetFieldValueFunction
}

export type FormRef = MutableRefObject<FormState | null>
