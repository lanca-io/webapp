import { type Provider } from '../../../../api/concero/types'
import { type ErrorType } from '../SwapButton/constants'
import { type TokenAmount } from '../../../../utils/TokenAmount'
import { type IRouteType, type Status, type ILancaChain, type ILancaToken, type StepType } from '@lanca/sdk'

export enum StageType {
	chain = 0,
	approve = 1,
	transaction = 2,
	success = 3,
	warning = 4,
	error = 5,
}

export interface StageStep {
	title: string
	status: Status
	type?: StageType
	body?: string
	txLink?: string
	txType?: StepType
	error?: string
	receivedAmount?: string
}
export interface SwapStateDirection {
	chain: {
		name: string
		symbol: string
		id: string
		logoURI: string
		providers: Provider[]
	}
	token: {
		name: string
		symbol: string
		address: `0x${string}` | string
		decimals: number
		logoURI: string
		coinGeckoId: string
		priceUsd: number | null
	}
	amount: string
	amount_usd: number
	address: string
}

export interface ButtonState {
	type: ErrorType
	message?: string
}

export enum SwapCardStage {
	input = 'input',
	progress = 'progress',
	review = 'review',
	failed = 'failed',
	success = 'success',
	warning = 'warning',
}

export interface Balance {
	amount: TokenAmount
	symbol: string
}

export interface SwapState {
	from: SwapStateDirection
	to: SwapStateDirection
	balance: Balance | null
	routes: IRouteType[]
	isNoRoutes: boolean
	isLoading: boolean
	selectedRoute: IRouteType | null
	typingTimeout: number
	stage: SwapCardStage
	steps: StageStep[]
	settings: Settings
	chains: any[]
	buttonState: ButtonState
	walletBalances: any
	isDestinationAddressVisible: boolean
	settingsModalOpen: boolean
	isTestnet: boolean
	isSufficientLiquidity: boolean
	inputError: ErrorType | null
}

export interface Settings {
	slippage_percent: string
	showDestinationAddress: boolean
	allowSwitchChain: boolean
}

export type ActionDirection = 'from' | 'to'

export enum SwapActionType {
	POPULATE_ROUTES = 'POPULATE_ROUTES',
	SET_LOADING = 'SET_LOADING',
	SET_IS_SUFFICIENT_LIQUIDITY = 'SET_IS_SUFFICIENT_LIQUIDITY',
	SET_INPUT_ERROR = 'SET_INPUT_ERROR',
	CLEAR_ROUTES = 'CLEAR_ROUTES',
	RESET_AMOUNTS = 'RESET_AMOUNTS',
	SET_IS_NO_ROUTES = 'SET_IS_NO_ROUTES',
	SET_SWAP_STAGE = 'SET_SWAP_STAGE',
	UPDATE_LAST_SWAP_STEP = 'UPDATE_LAST_SWAP_STEP',
	SET_BALANCE = 'SET_BALANCE',
	SET_CHAIN = 'SET_CHAIN',
	SET_TOKEN = 'SET_TOKEN',
	SET_AMOUNT = 'SET_AMOUNT',
	SET_ADDRESS = 'SET_ADDRESS',
	SET_SETTINGS = 'SET_SETTINGS',
	SET_SWAP_STEPS = 'SET_SWAP_STEPS',
	SWAP_DIRECTIONS = 'SWAP_DIRECTIONS',
	APPEND_SWAP_STEP = 'APPEND_SWAP_STEP',
}

export type SwapAction =
	| { type: SwapActionType.POPULATE_ROUTES; payload: IRouteType[]; fromAmount: string | null }
	| { type: SwapActionType.SET_LOADING; payload: boolean }
	| { type: SwapActionType.SET_IS_SUFFICIENT_LIQUIDITY; payload: boolean }
	| { type: SwapActionType.SET_INPUT_ERROR; payload: ErrorType | null }
	| { type: SwapActionType.CLEAR_ROUTES }
	| { type: SwapActionType.RESET_AMOUNTS; direction: ActionDirection }
	| { type: SwapActionType.SET_IS_NO_ROUTES; status: boolean }
	| { type: SwapActionType.SET_SWAP_STAGE; payload: SwapCardStage }
	| { type: SwapActionType.UPDATE_LAST_SWAP_STEP }
	| { type: SwapActionType.SET_BALANCE; payload: Balance | null }
	| { type: SwapActionType.SET_CHAIN; direction: ActionDirection; payload: { chain: ILancaChain } }
	| { type: SwapActionType.SET_TOKEN; direction: ActionDirection; payload: { token: ILancaToken } }
	| {
			type: SwapActionType.SET_AMOUNT
			direction: ActionDirection
			payload: { amount?: string; amount_usd?: number }
	  }
	| { type: SwapActionType.SET_ADDRESS; direction: ActionDirection; payload: string }
	| { type: SwapActionType.SET_SETTINGS; payload: any }
	| { type: SwapActionType.SET_SWAP_STEPS; payload: StageStep[] }
	| { type: SwapActionType.SWAP_DIRECTIONS }
	| { type: SwapActionType.APPEND_SWAP_STEP; payload: StageStep[] }
