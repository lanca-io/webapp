import { type Abi } from 'viem'

export const ParentPoolABI = [
	{
		inputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'link',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'usdc',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'lpToken',
						type: 'address',
					},
				],
				internalType: 'struct LancaParentPool.TokenConfig',
				name: 'tokenConfig',
				type: 'tuple',
			},
			{
				components: [
					{
						internalType: 'address',
						name: 'ccipRouter',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'automationForwarder',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'owner',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'lancaParentPoolCLFCLA',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'lancaBridge',
						type: 'address',
					},
					{
						internalType: 'address',
						name: 'clfRouter',
						type: 'address',
					},
					{
						internalType: 'address[3]',
						name: 'messengers',
						type: 'address[3]',
					},
				],
				internalType: 'struct LancaParentPool.AddressConfig',
				name: 'addressConfig',
				type: 'tuple',
			},
			{
				components: [
					{
						internalType: 'bytes32',
						name: 'distributeLiquidityJs',
						type: 'bytes32',
					},
					{
						internalType: 'bytes32',
						name: 'ethersJs',
						type: 'bytes32',
					},
					{
						internalType: 'bytes32',
						name: 'getChildPoolsLiquidityJsCodeHashSum',
						type: 'bytes32',
					},
				],
				internalType: 'struct LancaParentPool.HashConfig',
				name: 'hashConfig',
				type: 'tuple',
			},
			{
				components: [
					{
						internalType: 'uint256',
						name: 'minDepositAmount',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'depositFeeAmount',
						type: 'uint256',
					},
				],
				internalType: 'struct LancaParentPool.PoolConfig',
				name: 'poolConfig',
				type: 'tuple',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		inputs: [],
		name: 'DepositAmountBelowMinimum',
		type: 'error',
	},
	{
		inputs: [],
		name: 'DepositDeadlinePassed',
		type: 'error',
	},
	{
		inputs: [],
		name: 'DepositRequestNotReady',
		type: 'error',
	},
	{
		inputs: [],
		name: 'DepositsOnTheWayArrayFull',
		type: 'error',
	},
	{
		inputs: [],
		name: 'DistributeLiquidityRequestAlreadyProceeded',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'enum LibErrors.InvalidAddressType',
				name: 'errorType',
				type: 'uint8',
			},
		],
		name: 'InvalidAddress',
		type: 'error',
	},
	{
		inputs: [],
		name: 'InvalidCcipTxType',
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
		name: 'InvalidRouter',
		type: 'error',
	},
	{
		inputs: [],
		name: 'MaxDepositCapReached',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NotAllowedToCompleteDeposit',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'caller',
				type: 'address',
			},
		],
		name: 'OnlyRouterCanFulfill',
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
				name: 'sender',
				type: 'address',
			},
		],
		name: 'SenderNotAllowed',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'enum LibErrors.UnauthorizedType',
				name: 'errorType',
				type: 'uint8',
			},
		],
		name: 'Unauthorized',
		type: 'error',
	},
	{
		inputs: [],
		name: 'WithdrawAmountBelowMinimum',
		type: 'error',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'withdrawalId',
				type: 'bytes32',
			},
		],
		name: 'WithdrawRequestDoesntExist',
		type: 'error',
	},
	{
		inputs: [],
		name: 'WithdrawalAlreadyTriggered',
		type: 'error',
	},
	{
		inputs: [],
		name: 'WithdrawalRequestAlreadyExists',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'ccipMessageId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint64',
				name: 'srcChainSelector',
				type: 'uint64',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'sender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'CCIPReceived',
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
				internalType: 'uint64',
				name: 'destinationChainSelector',
				type: 'uint64',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'receiver',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'CCIPSent',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'lpAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'lpTokensToMint',
				type: 'uint256',
			},
		],
		name: 'DepositCompleted',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'lpAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'deadline',
				type: 'uint256',
			},
		],
		name: 'DepositInitiated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'lpAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'WithdrawalCompleted',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'childPoolsBalance',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'amountToDeposit',
				type: 'uint256',
			},
		],
		name: 'calculateLPTokensToMint',
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
				name: 'childPoolsBalance',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'clpAmount',
				type: 'uint256',
			},
		],
		name: 'calculateWithdrawableAmount',
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
				name: 'childPoolsBalance',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: 'clpAmount',
				type: 'uint256',
			},
		],
		name: 'calculateWithdrawableAmountViaDelegateCall',
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
				components: [
					{
						internalType: 'bytes32',
						name: 'messageId',
						type: 'bytes32',
					},
					{
						internalType: 'uint64',
						name: 'sourceChainSelector',
						type: 'uint64',
					},
					{
						internalType: 'bytes',
						name: 'sender',
						type: 'bytes',
					},
					{
						internalType: 'bytes',
						name: 'data',
						type: 'bytes',
					},
					{
						components: [
							{
								internalType: 'address',
								name: 'token',
								type: 'address',
							},
							{
								internalType: 'uint256',
								name: 'amount',
								type: 'uint256',
							},
						],
						internalType: 'struct Client.EVMTokenAmount[]',
						name: 'destTokenAmounts',
						type: 'tuple[]',
					},
				],
				internalType: 'struct Client.Any2EVMMessage',
				name: 'message',
				type: 'tuple',
			},
		],
		name: 'ccipReceive',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes',
			},
		],
		name: 'checkUpkeep',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'checkUpkeepViaDelegate',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
			{
				internalType: 'bytes',
				name: '',
				type: 'bytes',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'depositRequestId',
				type: 'bytes32',
			},
		],
		name: 'completeDeposit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'id',
				type: 'bytes32',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'completeRebalancing',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'uint256',
				name: 'amountToSend',
				type: 'uint256',
			},
			{
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
		],
		name: 'distributeLiquidity',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'clfReqId',
				type: 'bytes32',
			},
		],
		name: 'getClfReqTypeById',
		outputs: [
			{
				internalType: 'enum ILancaParentPool.ClfRequestType',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getDepositDeadlineSeconds',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'clfReqId',
				type: 'bytes32',
			},
		],
		name: 'getDepositRequestById',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'lpAddress',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'childPoolsLiquiditySnapshot',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'usdcAmountToDeposit',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'deadline',
						type: 'uint256',
					},
				],
				internalType: 'struct ILancaParentPool.DepositRequest',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getDepositsOnTheWay',
		outputs: [
			{
				components: [
					{
						internalType: 'uint64',
						name: 'chainSelector',
						type: 'uint64',
					},
					{
						internalType: 'bytes32',
						name: 'ccipMessageId',
						type: 'bytes32',
					},
					{
						internalType: 'uint256',
						name: 'amount',
						type: 'uint256',
					},
				],
				internalType: 'struct ILancaParentPool.DepositOnTheWay[150]',
				name: '',
				type: 'tuple[150]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 'getDstPoolByChainSelector',
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
		name: 'getDstTotalFeeInUsdc',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'pure',
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
		name: 'getMinDepositAmount',
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
		name: 'getOwner',
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
		name: 'getPendingWithdrawalRequestIds',
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
		name: 'getRouter',
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
		name: 'getUsdcLoansInUse',
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
				internalType: 'address',
				name: 'lpAddress',
				type: 'address',
			},
		],
		name: 'getWithdrawalIdByLPAddress',
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
		inputs: [
			{
				internalType: 'bytes32',
				name: 'withdrawalId',
				type: 'bytes32',
			},
		],
		name: 'getWithdrawalRequestById',
		outputs: [
			{
				components: [
					{
						internalType: 'address',
						name: 'lpAddress',
						type: 'address',
					},
					{
						internalType: 'uint256',
						name: 'lpAmountToBurn',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'totalCrossChainLiquiditySnapshot',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'amountToWithdraw',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'liquidityRequestedFromEachPool',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'remainingLiquidityFromChildPools',
						type: 'uint256',
					},
					{
						internalType: 'uint256',
						name: 'triggeredAtTimestamp',
						type: 'uint256',
					},
				],
				internalType: 'struct ILancaParentPool.WithdrawRequest',
				name: '',
				type: 'tuple',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getWithdrawalsOnTheWayAmount',
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
				internalType: 'bytes32',
				name: 'requestId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes',
				name: 'delegateCallResponse',
				type: 'bytes',
			},
			{
				internalType: 'bytes',
				name: 'err',
				type: 'bytes',
			},
		],
		name: 'handleOracleFulfillment',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'isFull',
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
				internalType: 'bytes',
				name: 'performData',
				type: 'bytes',
			},
		],
		name: 'performUpkeep',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
		],
		name: 'removePools',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'retryPerformWithdrawalRequest',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: 'poolAddress',
				type: 'address',
			},
		],
		name: 's_isSenderContractAllowed',
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
				internalType: 'uint64',
				name: 'chainSelector',
				type: 'uint64',
			},
			{
				internalType: 'address',
				name: 'pool',
				type: 'address',
			},
			{
				internalType: 'bool',
				name: 'isRebalancingNeeded',
				type: 'bool',
			},
		],
		name: 'setDstPool',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'newCap',
				type: 'uint256',
			},
		],
		name: 'setPoolCap',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'usdcAmount',
				type: 'uint256',
			},
		],
		name: 'startDeposit',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'lpAmount',
				type: 'uint256',
			},
		],
		name: 'startWithdrawal',
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
				internalType: 'address',
				name: 'token',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: 'receiver',
				type: 'address',
			},
		],
		name: 'takeLoan',
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
		inputs: [],
		name: 'withdrawDepositFees',
		outputs: [],
		stateMutability: 'payable',
		type: 'function',
	},
	{
		stateMutability: 'payable',
		type: 'receive',
	},
] as Abi
