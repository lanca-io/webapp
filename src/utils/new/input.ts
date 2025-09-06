import { preciseMultiply, preciseDivide } from './operations'
import { Decimal } from 'decimal.js'

/**
 * Formats a value based on numerical input.
 * Ensures that only valid numerical characters, percentage signs, and dollar signs are allowed.
 * Prevents a percentage sign from being inputted after a dollar sign and vice versa.
 * @param value - The value to format.
 * @returns The formatted value.
 */
export const sanitizeNumbers = (value: string): string => {
	let v = value.replace(/[^0-9.%$]/g, '')
	v = v.replace(/\.(?=.*\.)/g, '')
	v = v.replace(/[%$](?=.)/g, '')

	if (v.endsWith('%$') || v.endsWith('$%')) {
		v = v.slice(0, -2) + v.slice(-1)
	}

	if (v.includes('%') && v.includes('$')) {
		v = v.replace(/[%$]/g, '') + v.slice(-1)
	}

	return v
}

/**
 * Formats a value based on alphabetical input.
 * @param value - The value to format.
 * @returns The formatted value.
 */
export const sanitizeText = (value: string): string => {
	return value.toLowerCase().replace(/[^a-z]/g, '')
}

/**
 * Converts a token amount to its equivalent USD value.
 * @param tokenAmount - The amount of tokens to convert.
 * @param tokenPrice - The USD price per token.
 * @returns The equivalent USD value as a string, or null if conversion fails.
 */
export const tokenAmountToUsd = (tokenAmount: Decimal.Value, tokenPrice: Decimal.Value): string | null => {
	try {
		const amountDec = new Decimal(tokenAmount)
		const priceDec = new Decimal(tokenPrice)
		if (amountDec.isNaN() || priceDec.isNaN()) return null
		const usdVal = preciseMultiply(amountDec, priceDec)
		return usdVal.toString()
	} catch {
		return null
	}
}

/**
 * Converts a USD amount to its equivalent token value.
 * @param usdAmount - The USD amount to convert (with or without $ symbol).
 * @param tokenPrice - The USD price per token.
 * @returns The equivalent token amount as a string, or null if conversion fails.
 */
export const usdToTokenAmount = (usdAmount: Decimal.Value, tokenPrice: Decimal.Value): string | null => {
	try {
		let amountStr: string
		if (typeof usdAmount === 'string') {
			amountStr = usdAmount.replace('$', '')
		} else if (usdAmount instanceof Decimal) {
			amountStr = usdAmount.toString()
		} else {
			amountStr = usdAmount.toString()
		}
		const amountDec = new Decimal(amountStr)
		const priceDec = new Decimal(tokenPrice)
		if (amountDec.isNaN() || priceDec.isNaN() || priceDec.lte(0)) return null
		const tokenAmt = preciseDivide(amountDec, priceDec)
		return tokenAmt.toString()
	} catch {
		return null
	}
}

/**
 * Converts a percentage of a token balance to its equivalent USD value.
 * @param percentString - The percentage to convert (with or without % symbol).
 * @param balanceString - The token balance as a string or number.
 * @param tokenPrice - The USD price per token.
 * @returns The equivalent USD value as a string, or null if conversion fails.
 */
export const percentOfBalanceToUsd = (
	percentString: string,
	balanceString: Decimal.Value,
	tokenPrice: Decimal.Value,
): string | null => {
	try {
		const percentStr = percentString.replace('%', '')
		const percentDec = new Decimal(percentStr)
		const balanceDec = new Decimal(balanceString)
		const priceDec = new Decimal(tokenPrice)

		if (percentDec.isNaN() || balanceDec.isNaN() || priceDec.isNaN()) return null

		const tokenAmt = preciseMultiply(balanceDec, percentDec.div(100))
		const usdVal = preciseMultiply(tokenAmt, priceDec)
		return usdVal.toString()
	} catch {
		return null
	}
}

/**
 * Converts a text command (like 'max', 'half') to its equivalent USD value.
 * @param textCommand - The text command to interpret.
 * @param balanceValue - The token balance as a string or number.
 * @param tokenPrice - The USD price per token.
 * @returns The equivalent USD value as a string, or null if conversion fails.
 */
export const textCommandToUsd = (
	textCommand: string,
	balanceValue: Decimal.Value,
	tokenPrice: Decimal.Value,
): string | null => {
	try {
		const balanceDec = new Decimal(balanceValue)
		const tokenAmount = textToAmount(textCommand, balanceDec)
		if (tokenAmount === null) return null
		const priceDec = new Decimal(tokenPrice)
		if (priceDec.isNaN()) return null
		const usdVal = preciseMultiply(tokenAmount, priceDec)
		return usdVal.toString()
	} catch {
		return null
	}
}

/**
 * Converts a text keyword to a token amount based on the balance.
 * @param text - The text keyword (max, half, third, quarter).
 * @param balance - The token balance as Decimal.
 * @returns The calculated token amount as Decimal, or null if the keyword is not recognized.
 */
export const textToAmount = (text: string, balance: Decimal): Decimal | null => {
	const t = text.toLowerCase()
	switch (t) {
		case 'max':
			return balance
		case 'half':
			return preciseDivide(balance, new Decimal(2))
		case 'third':
			return preciseDivide(balance, new Decimal(3))
		case 'quarter':
			return preciseDivide(balance, new Decimal(4))
		default:
			return null
	}
}

/**
 * Cleans and normalizes a slippage input string.
 *
 * - Removes all characters except digits, dot, and percent sign.
 * - Allows at most one percent sign, keeping only the first if multiple are present.
 *
 * @param input - The raw input string from the user.
 * @returns The sanitized input string, suitable for further validation or parsing.
 */
export function normalizeSlippageInput(input: string): string {
	let cleaned = input.replace(/[^0-9.%]/g, '')
	const firstPercent = cleaned.indexOf('%')
	if (firstPercent !== -1) {
		cleaned = cleaned.slice(0, firstPercent + 1) + cleaned.slice(firstPercent + 1).replace(/%/g, '')
	}
	return cleaned
}
