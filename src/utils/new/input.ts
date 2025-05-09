import { toPreciseNumber, preciseMultiply, preciseDivide } from './operations'

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
export const tokenAmountToUsd = (tokenAmount: number, tokenPrice: number): string | null => {
	if (isNaN(tokenAmount) || isNaN(tokenPrice)) return null
	const usdValue = preciseMultiply(toPreciseNumber(tokenAmount), toPreciseNumber(tokenPrice))
	return usdValue.toString()
}

/**
 * Converts a USD amount to its equivalent token value.
 * @param usdAmount - The USD amount to convert (with or without $ symbol).
 * @param tokenPrice - The USD price per token.
 * @returns The equivalent token amount as a string, or null if conversion fails.
 */
export const usdToTokenAmount = (usdAmount: string | number, tokenPrice: number): string | null => {
	const amount =
		typeof usdAmount === 'string' ? toPreciseNumber(usdAmount.replace('$', '')) : toPreciseNumber(usdAmount)
	const price = toPreciseNumber(tokenPrice)
	if (isNaN(amount) || isNaN(price) || price <= 0) return null
	return preciseDivide(amount, price).toString()
}

/**
 * Converts a percentage of a token balance to its equivalent USD value.
 * @param percentString - The percentage to convert (with or without % symbol).
 * @param balanceString - The token balance as a string.
 * @param tokenPrice - The USD price per token.
 * @returns The equivalent USD value as a string, or null if conversion fails.
 */
export const percentOfBalanceToUsd = (
	percentString: string,
	balanceString: string,
	tokenPrice: number,
): string | null => {
	const percent = toPreciseNumber(percentString.replace('%', ''))
	const balance = toPreciseNumber(balanceString)
	const price = toPreciseNumber(tokenPrice)
	if (isNaN(percent) || isNaN(balance) || isNaN(price)) return null
	const tokenAmount = preciseMultiply(balance, percent / 100)
	return preciseMultiply(tokenAmount, price).toString()
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
	balanceValue: string | number,
	tokenPrice: number,
): string | null => {
	const balance = typeof balanceValue === 'string' ? toPreciseNumber(balanceValue) : toPreciseNumber(balanceValue)
	const tokenAmount = textToAmount(textCommand, balance)
	if (tokenAmount === null) return null
	return preciseMultiply(tokenAmount, tokenPrice).toString()
}

/**
 * Converts a text keyword to a token amount based on the balance.
 * @param text - The text keyword (max, half, third, quarter).
 * @param balance - The token balance.
 * @returns The calculated token amount, or null if the keyword is not recognized.
 */
export const textToAmount = (text: string, balance: number): number | null => {
	const t = text.toLowerCase()
	const b = toPreciseNumber(balance)
	switch (t) {
		case 'max':
			return b
		case 'half':
			return preciseDivide(b, 2)
		case 'third':
			return preciseDivide(b, 3)
		case 'quarter':
			return preciseDivide(b, 4)
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
