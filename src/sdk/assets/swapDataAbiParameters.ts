import { parseAbiParameters } from 'viem'

export const swapDataAbiParams = parseAbiParameters(
	'uint8 dexType, address fromToken, uint256 fromAmount, address toToken, uint256 toAmount, uint256 toAmountMin, bytes dexData',
)
