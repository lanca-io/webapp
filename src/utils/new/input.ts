/**
 * Formats a value based on numerical input.
 * Ensures that only valid numerical characters, percentage signs, and dollar signs are allowed.
 * Prevents a percentage sign from being inputted after a dollar sign and vice versa.
 * @param value - The value to format.
 * @returns The formatted value.
 */
export const sanitizeNumbers = (value: string): string => {
	// Remove all invalid characters except numbers, percent sign, dollar sign, and decimal point
	let formattedValue = value.replace(/[^0-9.%$]/g, '')

	// Ensure only one percent sign or dollar sign is present
	const percentIndex = formattedValue.indexOf('%')
	const dollarIndex = formattedValue.indexOf('$')

	// If both symbols are present, remove the second one
	if (percentIndex > -1 && dollarIndex > -1) {
		if (percentIndex > dollarIndex) {
			formattedValue = formattedValue.replace('%', '')
		} else {
			formattedValue = formattedValue.replace('$', '')
		}
	}

	// Ensure percent sign is at the end
	if (percentIndex > -1) {
		formattedValue = formattedValue.replace(/%/g, '') + '%'
	}

	// Ensure dollar sign is at the end
	if (dollarIndex > -1) {
		formattedValue = formattedValue.replace(/\$/g, '') + '$'
	}

	// Ensure only one decimal point is present
	const decimalIndex = formattedValue.indexOf('.')
	if (decimalIndex > -1) {
		formattedValue = formattedValue.replace(/\./g, (_match, offset) => (offset === decimalIndex ? '.' : ''))
	}

	// Remove any additional percent or dollar signs
	formattedValue = formattedValue.replace(/[%$]/g, (match, offset) => {
		if (match === '%' && offset !== formattedValue.length - 1) {
			return ''
		}
		if (match === '$' && offset !== formattedValue.length - 1) {
			return ''
		}
		return match
	})

	return formattedValue
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
 * Calculates the amount based on text input.
 * @param text - The text input.
 * @param balance - The balance to use for calculations.
 * @returns The calculated amount as a string or null if invalid.
 */
export const calculateAmountFromText = (text: string, balance: number): string | null => {
	switch (text.toLowerCase()) {
		case 'min':
			return '0'
		case 'max':
			return balance.toString()
		case 'quarter':
			return (balance / 4).toString()
		case 'half':
			return (balance / 2).toString()
		case 'third':
			return (balance / 3).toString()
		default:
			return null
	}
}
