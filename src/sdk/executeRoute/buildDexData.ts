import { type Step } from '../types/routeTypes'
import { type Address, encodeAbiParameters } from 'viem'

const uniswapV3RouterAddressesMap: Record<string, Address> = {
	'1': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
	'137': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
	'42161': '0xE592427A0AEce92De3Edee1F18E0157C05861564',
	'43114': '0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE',
	'8453': '0x2626664c2603336E57B271c5C0b26F421741e481',
}

export function buildDexData(step: Step, recipient: Address) {
	if (step.tool.name === 'uniswapV3Multi') {
		return encodeAbiParameters(
			[{ type: 'address' }, { type: 'bytes' }, { type: 'uint256' }],
			[
				uniswapV3RouterAddressesMap[step.from.chainId],
				step.tool.additional_info.tokenPath,
				BigInt(step.tool.additional_info.deadline),
			],
		)
	} else {
		return encodeAbiParameters(
			[{ type: 'address' }, { type: 'uint24' }, { type: 'uint160' }, { type: 'uint256' }],
			[
				uniswapV3RouterAddressesMap[step.from.chainId],
				step.tool.additional_info.fee,
				0n,
				step.tool.additional_info.deadline,
			],
		)
	}
}
