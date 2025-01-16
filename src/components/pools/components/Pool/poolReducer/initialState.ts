import { config } from '../../../../../constants/config'
import { parentPoolBase, lpTokenBase } from '../../../config/poolMainnetAddresses'
import { parentPoolBaseSepolia, lpTokenBaseSepolia } from '../../../config/poolTestnetAddresses'
import { ErrorType } from '../../../config/errors/ErrorType'
import { type PoolMode, PoolCardStage } from './types'

const createTokenConfig = (isTestnet: boolean) => {
	const chainId = isTestnet ? '84532' : '8453'
	const explorerURI = isTestnet ? 'https://sepolia.basescan.org' : 'https://basescan.org'
	const logoURI = isTestnet
		? 'https://api.concero.io/static/icons/chains/8453.svg'
		: 'https://api.concero.io/static/icons/chains/filled/8453.svg'
	const mainTokenAddress = isTestnet
		? '0x036CbD53842c5426634e7929541eC2318f3dCF7e'
		: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
	const mainTokenLogoURI = isTestnet
		? 'https://sepolia.basescan.org/images/main/empty-token.png'
		: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png'
	const lpTokenAddress = isTestnet ? lpTokenBaseSepolia : lpTokenBase
	const parentPoolAddress = isTestnet ? parentPoolBaseSepolia : parentPoolBase

	return {
		contractAddress: parentPoolAddress,
		chain: {
			addressPatterns: ['^(0x)[0-9A-Fa-f]{40}$'],
			explorerURI,
			id: chainId,
			logoURI,
			name: isTestnet ? 'BASE sepolia' : 'Base',
			symbol: 'ETH',
			tokens: [],
			providers: [],
		},
		mainToken: {
			address: mainTokenAddress,
			chain_id: chainId,
			decimals: 6,
			is_popular: true,
			logoURI: mainTokenLogoURI,
			name: isTestnet ? 'Base Sepolia USDC' : 'USD Coin',
			priceUsd: 1,
			symbol: 'USDC',
			coinGeckoId: '',
		},
		lpToken: {
			address: lpTokenAddress,
			chain_id: chainId,
			decimals: 18,
			is_popular: true,
			logoURI: './conceroToken.svg',
			name: 'Concero LP',
			priceUsd: null,
			symbol: isTestnet ? 'LP' : 'CLP',
			coinGeckoId: '',
		},
	}
}

const currentToken = createTokenConfig(config.IS_TESTNET)

export const poolInitialState = () => ({
	from: {
		chain: currentToken.chain,
		token: currentToken.mainToken,
		amount: '',
		amount_usd: 0.0,
		address: '',
		isLpToken: false,
	},
	to: {
		chain: currentToken.chain,
		token: currentToken.lpToken,
		amount: '',
		amount_usd: 0.0,
		address: '',
		isLpToken: true,
	},
	poolMode: 'deposit' as PoolMode,
	balance: null,
	routes: [],
	isNoRoutes: false,
	isLoading: false,
	selectedRoute: null,
	typingTimeout: 0,
	response: null,
	stage: PoolCardStage.input,
	steps: [],
	status: 'pending',
	settings: {
		slippage_percent: '5',
		showDestinationAddress: false,
		allowSwitchChain: true,
	},
	chains: [],
	buttonState: { type: ErrorType.ENTER_AMOUNT },
	walletBalances: null,
	isDestinationAddressVisible: false,
	settingsModalOpen: false,
	isTestnet: config.IS_TESTNET,
	isWithdrawInitiated: false,
	withdrawDeadline: null,
	inputError: null,
})
