/**
 * Formats a number to a fixed number of decimal places.
 * @param value - The number to format.
 * @param decimalPlaces - The number of decimal places to include.
 * @returns The formatted number as a string.
 */

export function toFixed(value: number, decimalPlaces: number = 2): string {
	return value.toFixed(decimalPlaces)
}

/**
 * Formats a number in scientific notation.
 * @param value - The number to format.
 * @returns The formatted number in scientific notation as a string.
 */
export function toScientific(value: number): string {
	return value.toExponential()
}

/**
 * Formats a number as a percentage.
 * @param value - The number to format.
 * @param decimalPlaces - The number of decimal places to include.
 * @returns The formatted percentage as a string.
 */
export function toPercentage(value: number, decimalPlaces?: number): string {
	const percentageValue = value * 100
	return decimalPlaces ? percentageValue.toFixed(decimalPlaces) + '%' : percentageValue.toString() + '%'
}

/**
 * Formats a number as a currency value.
 * @param value - The number to format.
 * @param currencySymbol - The currency symbol to include.
 * @param decimalPlaces - The number of decimal places to include.
 * @returns The formatted currency value as a string.
 */
export function toCurrency(value: number, currencySymbol: string = '$', decimalPlaces: number = 2): string {
	return currencySymbol + value.toFixed(decimalPlaces)
}

/**
 * Formats a number to a specified number of decimal places.
 * If the value is less than the threshold defined by the decimal places,
 * it returns a string representation of the threshold value.
 * Otherwise, it formats the number to the specified number of decimal places,
 * removing any trailing zeros.
 * @param value - The number to format.
 * @param decimalPlaces - The number of decimal places to include.
 * @returns The formatted number as a string.
 */
export function format(value: number, decimalPlaces: number = 2, symbol?: string): string {
	if (value === 0) return '0'

	if (value < Number(`0.${'0'.repeat(decimalPlaces - 1)}1`)) {
		return `> ${symbol || ''}0.${'0'.repeat(decimalPlaces - 1)}1`
	}

	return `${symbol || ''}${value.toFixed(decimalPlaces).replace(/\.?0+$/, '')}`
}
