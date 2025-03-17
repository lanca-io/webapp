import { formatUnits } from 'viem'

/**
 * Formats a token amount to at least 6 decimals.
 * @param amount - The amount to format.
 * @param decimals - The number of decimals for the token.
 * @returns The formatted amount as a string.
 */
export function formatTokenAmount(amount: string | undefined, decimals: number): string {
	if (!amount || isNaN(Number(amount))) {
		return '0'
	}

	const formattedAmount = formatUnits(BigInt(amount), decimals)
	const parsedAmount = Number.parseFloat(formattedAmount)
	if (!parsedAmount || Number.isNaN(Number(formattedAmount))) {
		return '0'
	}

	return parsedAmount.toString()
}

/**
 * Formats a token price based on the amount and price.
 * @param amount - The token amount as a string.
 * @param price - The price of the token.
 * @param decimals - The number of decimals for the token amount.
 * @returns The formatted token price as a number.
 */
export function formatTokenPrice(amount?: string, price?: string, decimals?: number): number {
	if (!amount || !price || isNaN(Number(amount)) || isNaN(Number(price))) {
		return 0
	}

	const formattedAmount = decimals !== undefined ? formatUnits(BigInt(amount), decimals) : amount

	if (Number.isNaN(Number(formattedAmount)) || Number.isNaN(Number(price))) {
		return 0
	}
	return Number.parseFloat(formattedAmount) * Number.parseFloat(price)
}
