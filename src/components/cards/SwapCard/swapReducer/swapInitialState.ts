import { SwapCardStage, type SwapState, type SwapStateDirection, type Settings, type ButtonState } from './types'
import { ErrorType } from '../SwapButton/constants'

interface Selection {
	swapCard: {
		from: {
			chain: any
			token: any
		}
		to: {
			chain: any
			token: any
		}
	}
}

export const swapInitialState = (selection: Selection): SwapState => {
	const from: SwapStateDirection = {
		chain: selection.swapCard.from.chain,
		token: selection.swapCard.from.token,
		amount: '',
		amount_usd: 0.0,
		address: '',
	}

	const to: SwapStateDirection = {
		chain: selection.swapCard.to.chain,
		token: selection.swapCard.to.token,
		amount: '',
		amount_usd: 0.0,
		address: '',
	}

	const settings: Settings = {
		slippage_percent: '5',
		showDestinationAddress: false,
		allowSwitchChain: true,
	}

	const buttonState: ButtonState = { type: ErrorType.ENTER_AMOUNT }

	return {
		from,
		to,
		balance: null,
		routes: [],
		isNoRoutes: false,
		isLoading: false,
		selectedRoute: null,
		typingTimeout: 0,
		stage: SwapCardStage.input,
		steps: [],
		settings,
		chains: [],
		buttonState,
		walletBalances: null,
		isDestinationAddressVisible: false,
		settingsModalOpen: false,
		isTestnet: false,
		isSufficientLiquidity: true,
		inputError: null,
	}
}
