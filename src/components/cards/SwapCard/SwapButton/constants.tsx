import { IconArrowsUpDown, IconGasStation, IconWallet } from '@tabler/icons-react'
import { type ReactNode } from 'react'

export enum ButtonType {
	LOADING = 1,
	SWAP = 2,
	ENTER_AMOUNT = 3,
	LOW_BALANCE = 4,
	LOW_GAS = 5,
	LOW_FEES = 6,
	CONNECT_WALLET = 7,
	NO_ROUTES = 8,
	REVIEW = 9,
	FETCH_BALANCES_LOADING = 10,
	CONNECT_WALLET_BRIGHT = 11,
	TESTNET_AMOUNT_TOO_HIGH = 12,
	TESTNET_AMOUNT_TOO_LOW = 13,
	NOT_SUFFICIENT_LIQUIDITY = 14,
	NOT_SUPPORTED_NATIVE_TOKENS = 15,
}

export const buttonText: { [key in ButtonType]: string } = {
	[ButtonType.LOADING]: 'button.findingRoutes',
	[ButtonType.SWAP]: 'button.swap',
	[ButtonType.ENTER_AMOUNT]: 'button.enterAmountToSwap',
	[ButtonType.LOW_BALANCE]: 'button.insufficientBalance',
	[ButtonType.LOW_GAS]: 'button.insufficientGas',
	[ButtonType.LOW_FEES]: 'button.insufficientFees',
	[ButtonType.CONNECT_WALLET]: 'button.connectWalletToSwap',
	[ButtonType.NO_ROUTES]: 'button.noRoutesFound',
	[ButtonType.REVIEW]: 'button.reviewSwap',
	[ButtonType.FETCH_BALANCES_LOADING]: '',
	[ButtonType.CONNECT_WALLET_BRIGHT]: 'button.connectWalletToSwap',
	[ButtonType.TESTNET_AMOUNT_TOO_HIGH]: 'Amount should not be greater than 30',
	[ButtonType.TESTNET_AMOUNT_TOO_LOW]: 'From amount is too low',
	[ButtonType.NOT_SUFFICIENT_LIQUIDITY]: 'Try lower amount',
	[ButtonType.NOT_SUPPORTED_NATIVE_TOKENS]: "Native tokens aren't supported",
}
