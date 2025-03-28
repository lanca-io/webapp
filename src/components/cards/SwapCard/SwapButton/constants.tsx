export enum ErrorType {
	ENTER_AMOUNT = 1,
	LOW_BALANCE = 2,
	LOW_GAS = 3,
	LOW_FEES = 4,
	NO_ROUTES = 5,
	AMOUNT_TOO_LOW = 6,
	NOT_SUFFICIENT_LIQUIDITY = 7,
	FETCH_ROUTE_FAILED = 8,
}

export const errorTextMap: { [key in ErrorType]: string } = {
	[ErrorType.ENTER_AMOUNT]: 'Enter amount to swap',
	[ErrorType.LOW_BALANCE]: 'Insufficient balance',
	[ErrorType.LOW_GAS]: 'Insufficient gas',
	[ErrorType.LOW_FEES]: 'Insufficient fees',
	[ErrorType.NO_ROUTES]: 'No routes found',
	[ErrorType.AMOUNT_TOO_LOW]: 'From amount is too low',
	[ErrorType.NOT_SUFFICIENT_LIQUIDITY]: 'Try lower amount',
	[ErrorType.FETCH_ROUTE_FAILED]: 'Failed to fetch route',
}

export enum ErrorCategory {
	input = 1,
	transaction = 2,
}

export const errorTypeMap: { [key in ErrorType]: ErrorCategory } = {
	[ErrorType.ENTER_AMOUNT]: ErrorCategory.input,
	[ErrorType.LOW_BALANCE]: ErrorCategory.input,
	[ErrorType.LOW_GAS]: ErrorCategory.transaction,
	[ErrorType.LOW_FEES]: ErrorCategory.transaction,
	[ErrorType.NO_ROUTES]: ErrorCategory.transaction,
	[ErrorType.AMOUNT_TOO_LOW]: ErrorCategory.input,
	[ErrorType.NOT_SUFFICIENT_LIQUIDITY]: ErrorCategory.transaction,
	[ErrorType.FETCH_ROUTE_FAILED]: ErrorCategory.transaction,
}
