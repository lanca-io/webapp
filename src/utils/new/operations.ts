/**
 * The factor determines decimal precision (1e9 = 9 decimals).
 * You can increase this for even higher precision if needed.
 */
const PRECISION_FACTOR = 1_000_000_000

/**
 * Multiplies two numbers precisely, avoiding floating-point errors.
 */
export function preciseMultiply(a: number | string, b: number | string): number {
	const aNum = Number(a)
	const bNum = Number(b)
	return Math.round(aNum * bNum * PRECISION_FACTOR) / PRECISION_FACTOR
}

/**
 * Divides two numbers precisely, avoiding floating-point errors.
 */
export function preciseDivide(a: number | string, b: number | string): number {
	const aNum = Number(a)
	const bNum = Number(b)
	if (bNum === 0) throw new Error('Division by zero')
	return Math.round((aNum / bNum) * PRECISION_FACTOR) / PRECISION_FACTOR
}

/**
 * Adds two numbers precisely.
 */
export function preciseAdd(a: number | string, b: number | string): number {
	const aNum = Number(a)
	const bNum = Number(b)
	return Math.round((aNum + bNum) * PRECISION_FACTOR) / PRECISION_FACTOR
}

/**
 * Subtracts two numbers precisely.
 */
export function preciseSubtract(a: number | string, b: number | string): number {
	const aNum = Number(a)
	const bNum = Number(b)
	return Math.round((aNum - bNum) * PRECISION_FACTOR) / PRECISION_FACTOR
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
	const str = String(num)

	if (!str.toLowerCase().includes('e')) {
		return BigInt(str)
	}

	const decimalStr = Number(str).toLocaleString('fullwide', { useGrouping: false })

	return BigInt(decimalStr)
}
