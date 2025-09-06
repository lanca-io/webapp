import { Decimal } from 'decimal.js'

/**
 * Multiplies two numbers precisely, avoiding floating-point errors.
 * Returns a Decimal instance.
 */
export function preciseMultiply(a: Decimal.Value, b: Decimal.Value): Decimal {
	return new Decimal(a).mul(new Decimal(b))
}

/**
 * Divides two numbers precisely, avoiding floating-point errors.
 * Returns a Decimal instance.
 */
export function preciseDivide(a: Decimal.Value, b: Decimal.Value): Decimal {
	const divisor = new Decimal(b)
	if (divisor.isZero()) throw new Error('Division by zero')
	return new Decimal(a).div(divisor)
}

/**
 * Adds two numbers precisely.
 * Returns a Decimal instance.
 */
export function preciseAdd(a: Decimal.Value, b: Decimal.Value): Decimal {
	return new Decimal(a).add(new Decimal(b))
}

/**
 * Subtracts two numbers precisely.
 * Returns a Decimal instance.
 */
export function preciseSubtract(a: Decimal.Value, b: Decimal.Value): Decimal {
	return new Decimal(a).sub(new Decimal(b))
}

/**
 * Converts a number or numeric string, including those in scientific notation,
 * to a BigInt.
 *
 * @param num - The input number or numeric string to convert.
 * @returns The BigInt representation of the input.
 * @throws Will throw an error if the input cannot be converted to a valid BigInt.
 */
export function scientificToBigInt(num: number | string): bigint {
	let str = String(num)

	if (/e/i.test(str)) {
		str = Number(str).toLocaleString('fullwide', { useGrouping: false })
	}

	const [integerPart] = str.split('.')

	if (!/^-?\d+$/.test(integerPart)) {
		throw new Error(`Invalid numeric format: ${str}`)
	}

	return BigInt(integerPart)
}
