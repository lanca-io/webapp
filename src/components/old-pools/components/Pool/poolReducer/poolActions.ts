import { handleBeforeUnload } from '../../../../../utils/leavingPageEvents'
import { type PoolMode, type PoolAction, type PoolState, PoolActionType } from './types'

export const poolActions: Record<PoolActionType, (state: PoolState, action: PoolAction) => PoolState> = {
	[PoolActionType.SET_BALANCE]: (state, action) => {
		if (action.type === PoolActionType.SET_BALANCE) {
			return { ...state, balance: action.payload ?? state.balance }
		}
		return state
	},
	[PoolActionType.SET_LOADING]: (state, action) => {
		if (action.type === PoolActionType.SET_LOADING) {
			return { ...state, isLoading: action.payload }
		}
		return state
	},
	[PoolActionType.SET_TOKEN]: (state, action) => {
		if (action.type === PoolActionType.SET_TOKEN) {
			return {
				...state,
				[action.direction]: { ...state[action.direction], token: action.payload.token },
			}
		}
		return state
	},
	[PoolActionType.SET_AMOUNT]: (state, action) => {
		if (action.type === PoolActionType.SET_AMOUNT) {
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
	[PoolActionType.RESET_AMOUNTS]: (state, action) => {
		if (action.type === PoolActionType.RESET_AMOUNTS) {
			return {
				...state,
				[action.direction]: { ...state[action.direction], amount: '', amount_usd: 0.0 },
			}
		}
		return state
	},
	[PoolActionType.SET_ADDRESS]: (state, action) => {
		if (action.type === PoolActionType.SET_ADDRESS) {
			return {
				...state,
				[action.direction]: { ...state[action.direction], address: action.payload },
			}
		}
		return state
	},
	[PoolActionType.SET_SWAP_STAGE]: (state, action) => {
		if (action.type === PoolActionType.SET_SWAP_STAGE) {
			if (action.payload === 'progress') {
				window.addEventListener('beforeunload', handleBeforeUnload)
			} else {
				window.removeEventListener('beforeunload', handleBeforeUnload)
			}
			return { ...state, stage: action.payload }
		}
		return state
	},
	[PoolActionType.SET_SWAP_STEPS]: (state, action) => {
		if (action.type === PoolActionType.SET_SWAP_STEPS) {
			return { ...state, steps: action.payload }
		}
		return state
	},
	[PoolActionType.APPEND_SWAP_STEP]: (state, action) => {
		if (action.type === PoolActionType.APPEND_SWAP_STEP) {
			return { ...state, steps: [...state.steps, action.payload] }
		}
		return state
	},
	[PoolActionType.SET_TO_ADDRESS]: (state, action) => {
		if (action.type === PoolActionType.SET_TO_ADDRESS) {
			return { ...state, to: { ...state.to, address: action.payload } }
		}
		return state
	},
	[PoolActionType.UPSERT_SWAP_STEP]: (state, action) => {
		if (action.type === PoolActionType.UPSERT_SWAP_STEP) {
			const newStep = action.payload
			const { steps } = state

			if (steps.length === 0) {
				return { ...state, steps: [newStep] }
			}

			steps.pop()
			steps.push(newStep)

			return { ...state, steps }
		}
		return state
	},
	[PoolActionType.UPDATE_LAST_SWAP_STEP]: (state, action) => {
		if (action.type === PoolActionType.UPDATE_LAST_SWAP_STEP) {
			return updateLastSwapState(state)
		}
		return state
	},
	[PoolActionType.SET_WALLET_BALANCES]: (state, action) => {
		if (action.type === PoolActionType.SET_WALLET_BALANCES) {
			return { ...state, walletBalances: action.payload.balances }
		}
		return state
	},
	[PoolActionType.SWAP_DIRECTIONS]: (state, action) => {
		if (action.type === PoolActionType.SWAP_DIRECTIONS) {
			const { from, to } = state
			return { ...state, from: to, to: from }
		}
		return state
	},
	[PoolActionType.SET_INPUT_ERROR]: (state, action) => {
		if (action.type === PoolActionType.SET_INPUT_ERROR) {
			return { ...state, inputError: action.payload }
		}
		return state
	},
	[PoolActionType.TOGGLE_POOL_MODE]: (state, action) => {
		if (action.type === PoolActionType.TOGGLE_POOL_MODE) {
			const poolMode = action.payload
			const { from, to } = switchDirections(state, action)

			return { ...state, from, to, poolMode }
		}
		return state
	},
}

const switchDirections = (state: PoolState, action: { payload: PoolMode }) => {
	const poolMode = action.payload
	const prevMode = state.poolMode

	if (poolMode === prevMode) return state

	return { ...state, from: state.to, to: state.from }
}

function updateLastSwapState(state: PoolState): PoolState {
	const lastStep = state.steps[state.steps.length - 1]
	if (lastStep?.status === 'pending' || lastStep?.status === 'await') {
		return { ...state, steps: [...state.steps.slice(0, state.steps.length - 1)] }
	}
	return state
}
