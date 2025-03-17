export type TextInputProps = {
	value?: string
	placeholder: string
	icon?: React.ReactNode
	isDisabled?: boolean
	title?: string
	type?: string
	className?: string
	onChangeText?: (value: string) => void
}
