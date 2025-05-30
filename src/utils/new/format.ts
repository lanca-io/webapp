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

	const absValue = Math.abs(value)
	const formattedValue =
		absValue < Number(`0.${'0'.repeat(decimalPlaces - 1)}1`)
			? `<${symbol || ''}0.${'0'.repeat(decimalPlaces - 1)}1`
			: `${symbol || ''}${absValue.toFixed(decimalPlaces).replace(/\.?0+$/, '')}`

	return value < 0 ? `-${formattedValue}` : formattedValue
}

/**
 * Capitalizes the first letter of a given string and converts the rest to lowercase.
 *
 * @param {string} str - The string to format.
 * @returns {string} - The formatted string with the first letter capitalized and the rest in lowercase.
 */
export const capitalizeFirstLetter = (str: string): string => {
	if (!str) {
		return ''
	}
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
