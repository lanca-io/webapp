import type { Abi } from 'viem'

export const poolsAbi: Abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: 'liquidityToken',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'lpToken',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'iouToken',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'conceroRouter',
				type: 'address',
			},
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
			{
				internalType: 'uint256',
				name: 'minTargetBalance',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'AddressShouldNotBeZero',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'expected',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'received',
				type: 'uint256',
			},
		],
		name: 'AmountExceedsDeficit',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'expected',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'received',
				type: 'uint256',
			},
		],
		name: 'AmountExceedsSurplus',
		type: 'error',
	},
	{
		inputs: [],
		name: 'AmountIsZero',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ChildPoolSnapshotsAreNotReady',
		type: 'error',
	},
	{
		inputs: [],
		name: 'DepositQueueIsFull',
		type: 'error',
	},
	{
		inputs: [],
		name: 'FunctionNotImplemented',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidAmount',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidChainSelector',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidConceroMessage',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidConceroMessageType',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'router',
				type: 'address',
			},
		],
		name: 'InvalidConceroRouter',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
		],
		name: 'InvalidDestinationChain',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
		],
		name: 'InvalidDstChainSelector',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
		],
		name: 'InvalidDstChainSelector',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidDstGasLimitOrCallData',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidLiqTokenDecimals',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidLurScoreSensitivity',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidReceiver',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidScoreWeights',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'liqCapAmount',
				type: 'uint256',
			},
		],
		name: 'LiquidityCapReached',
		type: 'error',
	},
	{
		inputs: [],
		name: 'OnlySelf',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'remainingLiquidityToCollectForWithdraw',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'totalAmountToWithdrawLocked',
				type: 'uint256',
			},
		],
		name: 'PendingWithdrawalsAreNotReady',
		type: 'error',
	},
	{
		inputs: [],
		name: 'QueuesAreNotFull',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'currentRelayer',
				type: 'address',
			},
		],
		name: 'RelayerAlreadySet',
		type: 'error',
	},
	{
		inputs: [],
		name: 'RelayerIsNotSet',
		type: 'error',
	},
	{
		inputs: [],
		name: 'RequiredValidatorsCountUnset',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: 'bits',
				type: 'uint8',
			},
			{
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'SafeCastOverflowedUintDowncast',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
		],
		name: 'SafeERC20FailedOperation',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'dstRelayerLib',
				type: 'address',
			},
		],
		name: 'UnauthorizedRelayerLib',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'caller',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'expected',
				type: 'address',
			},
		],
		name: 'UnauthorizedSender',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'currentValidator',
				type: 'address',
			},
		],
		name: 'ValidatorAlreadySet',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ValidatorIsNotSet',
		type: 'error',
	},
	{
		inputs: [],
		name: 'ValidatorsConsensusNotReached',
		type: 'error',
	},
	{
		inputs: [],
		name: 'WithdrawalQueueIsFull',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'tokenAmountAfterFee',
				type: 'uint256',
			},
		],
		name: 'BridgeDelivered',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				indexed: false,
				internalType: 'bytes',
				name: 'dstChainData',
				type: 'bytes',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'tokenSender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'tokenAmountBeforeFee',
				type: 'uint256',
			},
		],
		name: 'BridgeSent',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'rebalancer',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liqTokenAmount',
				type: 'uint256',
			},
		],
		name: 'DeficitFilled',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'lp',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liqTokenAmountWithFee',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lpTokenAmount',
				type: 'uint256',
			},
		],
		name: 'DepositProcessed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'lp',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'DepositQueued',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'IOUBridged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'receiver',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint24',
				name: 'srcChainSelector',
				type: 'uint24',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'IOUReceived',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'previousAdminRole',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'newAdminRole',
				type: 'bytes32',
			},
		],
		name: 'RoleAdminChanged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
		],
		name: 'RoleGranted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
		],
		name: 'RoleRevoked',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'uint24',
				name: 'sourceChainSelector',
				type: 'uint24',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'oldAmount',
				type: 'uint256',
			},
		],
		name: 'SrcBridgeReorged',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'rebalancer',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liqTokenAmount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'iouTokenAmount',
				type: 'uint256',
			},
		],
		name: 'SurplusTaken',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liqTokenAmountReceivedWithFee',
				type: 'uint256',
			},
		],
		name: 'WithdrawalCompleted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'lp',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liqTokenAmountToWithdraw',
				type: 'uint256',
			},
		],
		name: 'WithdrawalFailed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'lp',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lpTokenAmount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'liqTokenAmount',
				type: 'uint256',
			},
		],
		name: 'WithdrawalProcessed',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'withdrawId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'lp',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lpTokenAmount',
				type: 'uint256',
			},
		],
		name: 'WithdrawalQueued',
		type: 'event',
	},
	{
		inputs: [],
		name: 'ADMIN',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'DEFAULT_ADMIN_ROLE',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'LANCA_KEEPER',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'areQueuesFull',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenAmount',
				type: 'uint256',
			},
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				internalType: 'bytes',
				name: 'dstChainData',
				type: 'bytes',
			},
			{
				internalType: 'bytes',
				name: 'payload',
				type: 'bytes',
			},
		],
		name: 'bridge',
		outputs: [
			{
				internalType: 'bytes32',
				name: 'messageId',
				type: 'bytes32',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'receiver',
				type: 'bytes32',
			},
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				internalType: 'uint256',
				name: 'iouTokenAmount',
				type: 'uint256',
			},
		],
		name: 'bridgeIOU',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: 'messageReceipt',
				type: 'bytes',
			},
			{
				internalType: 'bool[]',
				name: 'validationChecks',
				type: 'bool[]',
			},
			{
				internalType: 'address[]',
				name: 'validatorLibs',
				type: 'address[]',
			},
			{
				internalType: 'address',
				name: 'relayerLib',
				type: 'address',
			},
		],
		name: 'conceroReceive',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'liquidityTokenAmount',
				type: 'uint256',
			},
		],
		name: 'enterDepositQueue',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'lpTokenAmount',
				type: 'uint256',
			},
		],
		name: 'enterWithdrawalQueue',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'liquidityAmountToFill',
				type: 'uint256',
			},
		],
		name: 'fillDeficit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getActiveBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
		],
		name: 'getBridgeIouNativeFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'uint24',
				name: 'dstChainSelector',
				type: 'uint24',
			},
			{
				internalType: 'bytes',
				name: 'dstChainData',
				type: 'bytes',
			},
			{
				internalType: 'bytes',
				name: 'payload',
				type: 'bytes',
			},
		],
		name: 'getBridgeNativeFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getChildPoolChainSelectors',
		outputs: [
			{
				internalType: 'uint24[]',
				name: '',
				type: 'uint24[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
		],
		name: 'getChildPoolSnapshot',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'balance',
						type: 'uint256',
					},
					{
						components: [
							{
								internalType: 'uint256',
								name: 'inflow',
								type: 'uint256',
							},
							{
								internalType: 'uint256',
								name: 'outflow',
								type: 'uint256',
							},
						],
						internalType: 'struct IBase.LiqTokenDailyFlow',
						name: 'dailyFlow',
						type: 'tuple',
					},
					{
						internalType: 'uint256',
						name: 'iouTotalSent',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'iouTotalReceived',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'iouTotalSupply',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'totalLiqTokenSent',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'totalLiqTokenReceived',
						type: 'uint256',
					},
					{
						internalType: 'uint32',
						name: 'timestamp',
						type: 'uint32',
					},
				],
				internalType: 'struct IParentPool.ChildPoolSnapshot',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getDeficit',
		outputs: [
			{
				internalType: 'uint256',
				name: 'deficit',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
		],
		name: 'getDstPool',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getIOUToken',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLancaBridgeFeeBps',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getLancaFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLiquidityCap',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLiquidityToken',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getLpFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLpFeeBps',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getLurScoreSensitivity',
		outputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMinDepositAmount',
		outputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMinDepositQueueLength',
		outputs: [
			{
				internalType: 'uint16',
				name: '',
				type: 'uint16',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMinWithdrawalAmount',
		outputs: [
			{
				internalType: 'uint64',
				name: '',
				type: 'uint64',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMinWithdrawalQueueLength',
		outputs: [
			{
				internalType: 'uint16',
				name: '',
				type: 'uint16',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getPendingWithdrawalIds',
		outputs: [
			{
				internalType: 'bytes32[]',
				name: '',
				type: 'bytes32[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getPoolData',
		outputs: [
			{
				internalType: 'uint256',
				name: 'deficit',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'surplus',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'getRebalancerFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getRebalancerFeeBps',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getRelayerLib',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
		],
		name: 'getRoleAdmin',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getScoresWeights',
		outputs: [
			{
				internalType: 'uint64',
				name: 'lurScoreWeight',
				type: 'uint64',
			},
			{
				internalType: 'uint64',
				name: 'ndrScoreWeight',
				type: 'uint64',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getSurplus',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getTargetBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getTodayStartTimestamp',
		outputs: [
			{
				internalType: 'uint32',
				name: '',
				type: 'uint32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getValidatorLib',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'totalPoolsBalance',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'lpTokenAmount',
				type: 'uint256',
			},
		],
		name: 'getWithdrawableAmount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'liqTokenAmount',
				type: 'uint256',
			},
		],
		name: 'getWithdrawalFee',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getYesterdayFlow',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'inflow',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'outflow',
						type: 'uint256',
					},
				],
				internalType: 'struct IBase.LiqTokenDailyFlow',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getYesterdayStartTimestamp',
		outputs: [
			{
				internalType: 'uint32',
				name: '',
				type: 'uint32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'grantRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'hasRole',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'admin',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'lancaKeeper',
				type: 'address',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'isReadyToProcessPendingWithdrawals',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'isReadyToTriggerDepositWithdrawProcess',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'processPendingWithdrawals',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'removeRelayerLib',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'removeValidatorLib',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'renounceRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'role',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'account',
				type: 'address',
			},
		],
		name: 'revokeRole',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'safeTransferWrapper',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint96',
				name: 'averageConceroMessageFee',
				type: 'uint96',
			},
		],
		name: 'setAverageConceroMessageFee',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint24',
				name: 'chainSelector',
				type: 'uint24',
			},
			{
				internalType: 'bytes32',
				name: 'dstPool',
				type: 'bytes32',
			},
		],
		name: 'setDstPool',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: 'lancaBridgeFeeBps',
				type: 'uint8',
			},
		],
		name: 'setLancaBridgeFeeBps',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'newLiqCap',
				type: 'uint256',
			},
		],
		name: 'setLiquidityCap',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: 'lpFeeBps',
				type: 'uint8',
			},
		],
		name: 'setLpFeeBps',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'lurScoreSensitivity',
				type: 'uint64',
			},
		],
		name: 'setLurScoreSensitivity',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'newMinDepositAmount',
				type: 'uint64',
			},
		],
		name: 'setMinDepositAmount',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint16',
				name: 'length',
				type: 'uint16',
			},
		],
		name: 'setMinDepositQueueLength',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'newMinWithdrawalAmount',
				type: 'uint64',
			},
		],
		name: 'setMinWithdrawalAmount',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint16',
				name: 'length',
				type: 'uint16',
			},
		],
		name: 'setMinWithdrawalQueueLength',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint8',
				name: 'rebalancerFeeBps',
				type: 'uint8',
			},
		],
		name: 'setRebalancerFeeBps',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'relayerLib',
				type: 'address',
			},
		],
		name: 'setRelayerLib',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'lurScoreWeight',
				type: 'uint64',
			},
			{
				internalType: 'uint64',
				name: 'ndrScoreWeight',
				type: 'uint64',
			},
		],
		name: 'setScoresWeights',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'validatorLib',
				type: 'address',
			},
		],
		name: 'setValidatorLib',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes4',
				name: 'interfaceId',
				type: 'bytes4',
			},
		],
		name: 'supportsInterface',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'iouTokensToBurn',
				type: 'uint256',
			},
		],
		name: 'takeSurplus',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'topUpRebalancingFee',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'triggerDepositWithdrawProcess',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		stateMutability: 'payable',
		type: 'receive',
	},
]
