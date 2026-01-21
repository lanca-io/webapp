export enum InputActionType {
	CHANGE = 'CHANGE',
	FOCUS = 'FOCUS',
	BLUR = 'BLUR',
	SET_WARNING = 'SET_WARNING',
	CLEAR_WARNING = 'CLEAR_WARNING',
	SET_ERROR = 'SET_ERROR',
	CLEAR_ERROR = 'CLEAR_ERROR',
	RESET = 'RESET',
}

export type InputState = {
	input: string
	rawInput: bigint
	warning: string | null
	error: string | null
	isFocused: boolean
	isTouched: boolean
	isValid: boolean
}

export type InputAction =
	| { type: InputActionType.CHANGE; payload: string }
	| { type: InputActionType.FOCUS }
	| { type: InputActionType.BLUR }
	| { type: InputActionType.SET_WARNING; payload: string }
	| { type: InputActionType.CLEAR_WARNING }
	| { type: InputActionType.SET_ERROR; payload: string }
	| { type: InputActionType.CLEAR_ERROR }
	| { type: InputActionType.RESET }

export type InputContextValue = {
	state: InputState
	dispatch: React.Dispatch<InputAction>
}
