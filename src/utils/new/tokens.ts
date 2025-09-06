import type { ExtendedToken } from '../../store/tokens/types'
import { formatUnits } from 'viem'
import { preciseMultiply, scientificToBigInt } from './operations'
import { Decimal } from 'decimal.js'

/**
 * Converts raw token amount (in smallest unit) to human-readable format
 * with proper decimal handling and trailing zero trimming.
 *
 * @param amount - Raw token amount as string (e.g. "123456789" for 1.23456789 ETH)
 * @param decimals - Number of decimal places the token uses
 * @returns Human-readable amount as string (e.g. "1.234568")
 */
export function formatTokenAmount(amount: string | undefined | null, decimals: number): string {
	if (!amount) return '0'
	try {
		const rawInt = scientificToBigInt(amount)
		const formatted = formatUnits(rawInt, decimals)
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
		const usdValue = preciseMultiply(new Decimal(amountHuman), new Decimal(price))
		// Convert Decimal to number safely, consider rounding if needed
		return usdValue.toNumber()
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
	if (!amount) return '0'

	try {
		const factor = new Decimal(10).pow(decimals)
		const amountDec = new Decimal(amount)
		const rawDec = preciseMultiply(amountDec, factor)
		const rawStr = rawDec.toFixed(0)
		const rawInt = scientificToBigInt(rawStr)

		if (rawInt > BigInt(Number.MAX_SAFE_INTEGER)) {
			// Consider switching to string or BigInt safe handling everywhere if this is problematic
			throw new Error('Value exceeds safe integer range')
		}

		return rawInt.toString()
	} catch (error) {
		console.error('Parse error:', error)
		return '0'
	}
}

/**
 * Compares two tokens to determine if they're functionally equal.
 * Only compares essential properties that would affect UI or behavior
 * to avoid unnecessary re-renders and updates in React components.
 *
 * @param a - First token to compare
 * @param b - Second token to compare
 * @returns `true` if tokens have the same essential properties, `false` otherwise
 */
export const areTokensEqual = (a: ExtendedToken, b: ExtendedToken): boolean => {
	return (
		a.address === b.address &&
		a.chain_id === b.chain_id &&
		a.balance === b.balance &&
		a.symbol === b.symbol &&
		a.decimals === b.decimals
	)
}
