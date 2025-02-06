import { handleBeforeUnload } from '../../../../utils/leavingPageEvents'
import { type SwapState, SwapActionType, type SwapAction, StageType } from './types'
import { trackEvent } from '../../../../hooks/useTracking'
import { action as trackingAction, category as trackingCategory } from '../../../../constants/tracking'
import { Status } from '@lanca/sdk'

export const swapActions: Record<SwapActionType, (state: SwapState, action: SwapAction) => SwapState> = {
	[SwapActionType.POPULATE_ROUTES]: (state, action) => {
		if (action.type === SwapActionType.POPULATE_ROUTES) {
			if (action.fromAmount !== state.from.amount) return state
			return { ...state, routes: action.payload, selectedRoute: action.payload[0] }
		}
		return state
	},

	[SwapActionType.SET_LOADING]: (state, action) => {
		if (action.type === SwapActionType.SET_LOADING) {
			return { ...state, isLoading: action.payload }
		}
		return state
	},

	[SwapActionType.SET_IS_SUFFICIENT_LIQUIDITY]: (state, action) => {
		if (action.type === SwapActionType.SET_IS_SUFFICIENT_LIQUIDITY) {
			const isSufficientLiquidity = action.payload
			return { ...state, isSufficientLiquidity }
		}
		return state
	},

	[SwapActionType.SET_INPUT_ERROR]: (state, action) => {
		if (action.type === SwapActionType.SET_INPUT_ERROR) {
			const inputError = action.payload
			return { ...state, inputError }
		}
		return state
	},

	[SwapActionType.CLEAR_ROUTES]: state => ({ ...state, isLoading: false, routes: [], selectedRoute: null }),

	[SwapActionType.RESET_AMOUNTS]: (state, action) => {
		if (action.type === SwapActionType.RESET_AMOUNTS) {
			return {
				...state,
				[action.direction]: { ...state[action.direction], amount: '', amount_usd: 0.0 },
			}
		}
		return state
	},

	[SwapActionType.SET_IS_NO_ROUTES]: (state, action) => {
		if (action.type === SwapActionType.SET_IS_NO_ROUTES) {
			return { ...state, isNoRoutes: action.status }
		}
		return state
	},

	[SwapActionType.SET_SWAP_STAGE]: (state, action) => {
		if (action.type === SwapActionType.SET_SWAP_STAGE) {
			if (action.payload === 'progress') {
				window.addEventListener('beforeunload', handleBeforeUnload)
			} else {
				window.removeEventListener('beforeunload', handleBeforeUnload)
			}
			return { ...state, stage: action.payload }
		}
		return state
	},

	[SwapActionType.APPEND_SWAP_STEP]: (state, action) => {
		if (action.type === SwapActionType.APPEND_SWAP_STEP) {
			if (state.steps[0]?.status === Status.FAILED || state.steps[0]?.status === Status.REJECTED) {
				return state
			}
			const newSteps = Array.isArray(action.payload) ? action.payload : [action.payload]
			const updatedSteps = [...state.steps]

			newSteps.forEach(newStep => {
				const exists = updatedSteps.some(
					step =>
						step.title === newStep.title &&
						step.status === newStep.status &&
						step.type === newStep.type &&
						(step.type !== StageType.transaction || step.txType === newStep.txType),
				)
				if (!exists) {
					updatedSteps.push(newStep)
				}
			})

			return {
				...state,
				steps: updatedSteps,
			}
		}
		return state
	},

	[SwapActionType.UPDATE_LAST_SWAP_STEP]: updateLastSwapState,

	[SwapActionType.SET_BALANCE]: (state, action) => {
		if (action.type === SwapActionType.SET_BALANCE) {
			return { ...state, balance: action.payload }
		}
		return state
	},

	[SwapActionType.SET_CHAIN]: (state, action) => {
		if (action.type === SwapActionType.SET_CHAIN) {
			const { chain } = action.payload
			return { ...state, [action.direction]: { ...state[action.direction], chain } }
		}
		return state
	},

	[SwapActionType.SET_TOKEN]: (state, action) => {
		if (action.type === SwapActionType.SET_TOKEN) {
			return {
				...state,
				[action.direction]: { ...state[action.direction], token: action.payload.token },
			}
		}
		return state
	},

	[SwapActionType.SET_AMOUNT]: (state, action) => {
		if (action.type === SwapActionType.SET_AMOUNT) {
			return {
				...state,
				[action.direction]: {
					...state[action.direction],
					...(action.payload.amount !== undefined &&
						action.payload.amount !== null && { amount: action.payload.amount }),
					...(action.payload.amount_usd !== undefined &&
						action.payload.amount_usd !== null && { amount_usd: action.payload.amount_usd }),
				},
			}
		}
		return state
	},

	[SwapActionType.SET_ADDRESS]: (state, action) => {
		if (action.type === SwapActionType.SET_ADDRESS) {
			return {
				...state,
				[action.direction]: { ...state[action.direction], address: action.payload },
			}
		}
		return state
	},

	[SwapActionType.SET_SETTINGS]: (state, action) => {
		if (action.type === SwapActionType.SET_SETTINGS) {
			trackEvent({
				category: trackingCategory.SwapCard,
				action: trackingAction.ToggleSettingsModal,
				label: 'set_settings',
				data: state.settings,
			})
			return { ...state, settings: { ...state.settings, ...action.payload } }
		}
		return state
	},

	[SwapActionType.SET_SWAP_STEPS]: (state, action) => {
		if (action.type === SwapActionType.SET_SWAP_STEPS) {
			return { ...state, steps: action.payload }
		}
		return state
	},

	[SwapActionType.SWAP_DIRECTIONS]: state => {
		const { from, to } = state
		return { ...state, from: to, to: from }
	},
}

function updateLastSwapState(state: SwapState): SwapState {
	const lastStep = state.steps[state.steps.length - 1]
	if (lastStep?.status === Status.PENDING) {
		return { ...state, steps: [...state.steps.slice(0, state.steps.length - 1)] }
	}
	return state
}
