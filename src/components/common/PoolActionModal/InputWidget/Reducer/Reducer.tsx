import { sanitizeNumbers } from '@/utils/input'
import { parseUnits } from 'viem'
import { InputState, InputAction, InputActionType } from './types'

export const initialState: InputState = {
	input: '',
	rawInput: 0n,
	isFocused: false,
	isTouched: false,
	isValid: false,
	warning: null,
	error: null,
}

export const InputWidgetReducer = (
	state: InputState = initialState,
	action: InputAction,
): InputState => {
	switch (action.type) {
		case InputActionType.CHANGE: {
			const input = sanitizeNumbers(action.payload)
			const rawInput = parseUnits(input || '0', 6)
			const isValid = rawInput > 0n

			return {
				...state,
				input,
				rawInput,
				isTouched: true,
				isValid,
				warning: null,
				error: null,
			}
		}

		case InputActionType.FOCUS:
			return { ...state, isFocused: true }

		case InputActionType.BLUR:
			return { ...state, isFocused: false }

		case InputActionType.SET_WARNING:
			return {
				...state,
				warning: action.payload,
			}

		case InputActionType.CLEAR_WARNING:
			return {
				...state,
				warning: null,
			}

		case InputActionType.SET_ERROR:
			return {
				...state,
				error: action.payload,
				isValid: false,
			}

		case InputActionType.CLEAR_ERROR:
			return {
				...state,
				error: null,
				isValid: state.rawInput > 0n,
			}

		case InputActionType.RESET:
			return initialState

		default:
			return state
	}
}
