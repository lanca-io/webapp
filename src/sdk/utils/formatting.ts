import { parseUnits } from 'viem'

export const createBigIntAmount = (amount: string, decimals: number) => {
	return parseUnits(amount, decimals)
}
