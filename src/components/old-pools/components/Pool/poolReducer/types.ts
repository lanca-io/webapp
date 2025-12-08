import { type TokenAmount } from '../../../../../utils/TokenAmount'
import { type ErrorType } from '../../../config/errors/ErrorType'

export interface Provider {
	name: string
	symbol: string
	_id: string
}

export enum StageType {
	approve = 1,
	requestTx = 2,
	transaction = 3,
	transactionSigned = 4,
}

export type StageStepStatus = 'idle' | 'pending' | 'await' | 'success' | 'error'

export interface StageStep {
	title: string
	status: StageStepStatus
	type?: StageType
	body?: string
	txLink?: string | null | undefined
}

export interface PoolStateDirection {
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
	isLpToken: boolean
}

export enum PoolCardStage {
	input = 'input',
	review = 'review',
	progress = 'progress',
	failed = 'failed',
	success = 'success',
	warning = 'warning',
}

export interface Balance {
	amount: TokenAmount
	symbol: string
}

export type PoolMode = 'deposit' | 'withdraw'

export interface PoolState {
	poolMode: PoolMode
	from: PoolStateDirection
	to: PoolStateDirection
	steps: StageStep[]

	typingTimeout: number
	stage: PoolCardStage
	settings: Settings
	balance: Balance | null

	isLoading: boolean
	isTestnet: boolean
	inputError: ErrorType | null
}

export interface Settings {
	slippage_percent: string
	showDestinationAddress: boolean
	allowSwitchChain: boolean
}

type ActionDirection = 'from' | 'to'

export enum PoolActionType {
	SET_BALANCE = 'SET_BALANCE',
	SET_LOADING = 'SET_LOADING',
	SET_TOKEN = 'SET_TOKEN',
	SET_AMOUNT = 'SET_AMOUNT',
	RESET_AMOUNTS = 'RESET_AMOUNTS',
	SET_ADDRESS = 'SET_ADDRESS',
	SET_SWAP_STAGE = 'SET_SWAP_STAGE',
	SET_SWAP_STEPS = 'SET_SWAP_STEPS',
	APPEND_SWAP_STEP = 'APPEND_SWAP_STEP',
	SET_TO_ADDRESS = 'SET_TO_ADDRESS',
	UPSERT_SWAP_STEP = 'UPSERT_SWAP_STEP',
	UPDATE_LAST_SWAP_STEP = 'UPDATE_LAST_SWAP_STEP',
	SET_WALLET_BALANCES = 'SET_WALLET_BALANCES',
	SWAP_DIRECTIONS = 'SWAP_DIRECTIONS',
	SET_INPUT_ERROR = 'SET_INPUT_ERROR',
	TOGGLE_POOL_MODE = 'TOGGLE_POOL_MODE',
}

export type PoolAction =
	| { type: PoolActionType.SET_BALANCE; payload: Balance | null }
	| { type: PoolActionType.SET_LOADING; payload: boolean }
	| { type: PoolActionType.SET_TOKEN; direction: ActionDirection; payload: { token: Token } }
	| {
			type: PoolActionType.SET_AMOUNT
			direction: ActionDirection
			payload: { amount?: string; amount_usd?: number }
	  }
	| { type: PoolActionType.RESET_AMOUNTS; direction: ActionDirection }
	| { type: PoolActionType.SET_ADDRESS; direction: ActionDirection; payload: string }
	| { type: PoolActionType.SET_SWAP_STAGE; payload: PoolCardStage }
	| { type: PoolActionType.SET_SWAP_STEPS; payload: StageStep[] }
	| { type: PoolActionType.APPEND_SWAP_STEP; payload: StageStep }
	| { type: PoolActionType.SET_TO_ADDRESS; payload: string }
	| { type: PoolActionType.UPSERT_SWAP_STEP; payload: any }
	| { type: PoolActionType.UPDATE_LAST_SWAP_STEP }
	| { type: PoolActionType.SET_WALLET_BALANCES; payload: { balances: any } }
	| { type: PoolActionType.SWAP_DIRECTIONS }
	| { type: PoolActionType.SET_INPUT_ERROR; payload: ErrorType | null }
	| { type: PoolActionType.TOGGLE_POOL_MODE; payload: PoolMode }
