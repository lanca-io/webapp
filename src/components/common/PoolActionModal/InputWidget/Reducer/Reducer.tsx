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
			console.log('CHANGE DEBUG - payload:', `"${action.payload}"`)
			const input = sanitizeNumbers(action.payload)
			console.log('Sanitized input:', `"${input}"`)
			const rawInput = parseUnits(input || '0', 6)
			console.log('Parsed raw input:', rawInput.toString(), typeof rawInput)
			console.log('isValid check:', rawInput > 0n)
			const isValid = rawInput > 0n

			console.log('NEW STATE:', {
				input,
				rawInput: rawInput.toString(),
				isValid,
			})

			return {
				...state,
				input,
				rawInput,
				isTouched: true,
				isValid,
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
