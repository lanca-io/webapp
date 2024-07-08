export const conceroAbi = [
	{
		inputs: [
			{
				components: [
					{
						internalType: 'enum IDexSwap.DexType',
						name: 'dexType',
						type: 'uint8',
					},
					{
						internalType: 'address',
						name: 'fromToken',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'fromAmount',
						type: 'uint256',
					},
					{
						internalType: 'address',
						name: 'toToken',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'toAmount',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'toAmountMin',
						type: 'uint256',
					},
					{
						internalType: 'bytes',
						name: 'dexData',
						type: 'bytes',
					},
				],
				internalType: 'struct IDexSwap.SwapData[]',
				name: '_swapData',
				type: 'tuple[]',
			},
			{
				internalType: 'address',
				name: '_receiver',
				type: 'address',
			},
		],
		name: 'swap',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
]
