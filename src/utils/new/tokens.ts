import { formatUnits } from 'viem'
import { toPreciseNumber, preciseMultiply } from './operations'

/**
 * Converts raw token amount (in smallest unit) to human-readable format
 * with proper decimal handling and trailing zero trimming.
 *
 * @param amount - Raw token amount as string (e.g. "123456789" for 1.23456789 ETH)
 * @param decimals - Number of decimal places the token uses
 * @returns Human-readable amount as string (e.g. "1.234568")
 */
export function formatTokenAmount(amount: string | undefined | null, decimals: number): string {
	if (!amount || isNaN(Number(amount))) return '0'

	try {
		const formatted = formatUnits(BigInt(amount), decimals)
		// Trim trailing zeros and unnecessary decimal point
		return formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.$/, '')
	} catch (error) {
		console.error('Format error:', error)
		return '0'
	}
}

/**
 * Calculates USD value of a token amount using precise decimal arithmetic.
 *
 * @param amount - Raw token amount as string
 * @param price - USD price per token as string or number
 * @param decimals - Token decimals for amount conversion
 * @returns USD value as number with maximum precision
 */
export function formatTokenPrice(amount?: string, price?: string | number, decimals?: number): number {
	if (!amount || !price) return 0

	try {
		const amountHuman = decimals !== undefined ? formatTokenAmount(amount, decimals) : amount
		return preciseMultiply(toPreciseNumber(amountHuman), toPreciseNumber(price))
	} catch (error) {
		console.error('Price calculation error:', error)
		return 0
	}
}

/**
 * Converts human-readable token amount to raw units (smallest denomination)
 * with precise decimal handling and validation.
 *
 * @param amount - Human-readable amount (e.g. "1.2345")
 * @param decimals - Token decimals for conversion
 * @returns Raw amount as string (e.g. "123450000" for 1.2345 with 8 decimals)
 */
export function parseTokenAmount(amount: string, decimals: number): string {
	if (!amount || isNaN(Number(amount))) return '0'

	try {
		const decimalsFactor = 10 ** decimals
		const preciseValue = toPreciseNumber(amount)
		const rawValue = preciseMultiply(preciseValue, decimalsFactor)

		if (!Number.isSafeInteger(rawValue)) {
			throw new Error('Value exceeds safe integer range')
		}

		return rawValue.toFixed(0)
	} catch (error) {
		console.error('Parse error:', error)
		return '0'
	}
}
