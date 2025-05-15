import type {
	IRouteInternalStep,
	IInputSwapData,
	IPrepareTransactionArgsReturnType,
	IInputRouteData,
	IRouteType,
	IBridgeData,
	IIntegration,
	IRouteStep,
	SwapArgs,
	TxName,
} from '@lanca/sdk'
import type { Address, Hex, StateOverride } from 'viem'
import { chainSelectors } from '../../configuration/selectors'
import { StepType } from '@lanca/sdk'
import { swapDataAbi } from '../../assets/abi/SwapData'
import { encodeAbiParameters, zeroAddress } from 'viem'
import { parseAbiParameters } from 'viem'
import { encodeFunctionData } from 'viem'
import { erc20Abi } from 'viem'
import { LibZip } from 'solady'

/**
 * Builds route data for contract calls, separating source swaps, bridge, and destination swaps.
 *
 * @param route - The route object containing all steps.
 * @param user - The user's address (receiver).
 * @returns IInputRouteData with srcSwapData, bridgeData, and dstSwapData arrays.
 */
export function buildRouteData(route: IRouteType, address: Address): IInputRouteData {
	let bridge: IBridgeData | null = null
	const src: IInputSwapData[] = []
	const dst: IInputSwapData[] = []

	for (const step of route.steps) {
		if (step.type === StepType.BRIDGE) {
			const { from, to } = step as IRouteStep
			bridge = {
				token: from.token.address,
				amount: BigInt(from.amount),
				dstChainSelector: chainSelectors?.[to.chain.id],
				receiver: address,
				compressedDstSwapData: '0x',
			}
		} else if (step.type === StepType.SRC_SWAP || step.type === StepType.DST_SWAP) {
			for (const s of (step as IRouteStep).internalSteps) {
				const swap = buildSwapData(s)
				bridge ? dst.push(swap) : src.push(swap)
			}
		}
	}
	return { srcSwapData: src, bridgeData: bridge, dstSwapData: dst }
}

/**
 * Builds the swap data object required for a contract call from a route internal step.
 * Throws an error if any required field is missing.
 *
 * @param step - The internal step containing swap details.
 * @returns IInputSwapData - The formatted swap data for contract interaction.
 */
export function buildSwapData(step: IRouteInternalStep): IInputSwapData {
	const { tool, from, to } = step
	if (!tool?.data || !from?.token?.address || !to?.token?.address || !tool.amountOutMin) {
		throw new Error('Invalid swap step data')
	}
	const { dexCallData, dexRouter } = tool.data
	return {
		dexRouter,
		fromToken: from.token.address,
		fromAmount: BigInt(from.amount),
		toToken: to.token.address,
		toAmount: BigInt(to.amount),
		toAmountMin: BigInt(tool.amountOutMin),
		dexCallData,
	}
}

/**
 * Encodes and compresses an array of swap data for efficient contract transmission.
 *
 * @param swapDataArray - Array of swap data objects to encode and compress.
 * @returns A compressed hex string representing the encoded swap data.
 */
export function encodeAndCompressSwapData(swapDataArray: IInputSwapData[]): string {
	const encoded = encodeAbiParameters([swapDataAbi], [swapDataArray])
	return LibZip.cdCompress(encoded) as string
}

/**
 * Prepares transaction arguments for contract calls based on route data and user context.
 * Handles swap, bridge, and swapAndBridge scenarios, and determines native token usage.
 *
 * @param routeData - The input route data (src/dst swaps, bridge).
 * @param user - The user's address (sender).
 * @param firstStep - The first swap step in the route.
 * @returns An object with txName, args, isFromNativeToken, and fromAmount.
 */
export function prepareTxArgs(
	routeData: IInputRouteData,
	user: Address,
	firstStep: IRouteStep,
	integrator: Address,
	feeBps: bigint,
): IPrepareTransactionArgsReturnType {
	const { srcSwapData, bridgeData, dstSwapData } = routeData
	const integration: IIntegration = { integrator, feeBps }
	let args: SwapArgs = [srcSwapData, user, integration]
	let txName: TxName = 'swap'

	if (bridgeData) {
		const compressed = dstSwapData.length > 0 ? encodeAndCompressSwapData(dstSwapData) : '0x'
		bridgeData.compressedDstSwapData = compressed as Address
		args = [bridgeData, integration]
		if (srcSwapData.length > 0) {
			txName = 'swapAndBridge'
			args.splice(1, 0, srcSwapData)
		} else {
			txName = 'bridge'
		}
	}
	const isFromNativeToken = firstStep.from.token.address === zeroAddress
	const fromAmount = BigInt(firstStep.from.amount)
	return { txName, args, isFromNativeToken, fromAmount }
}

/**
 * Given a route and user/integrator context, prepares all arguments needed for contract call estimation/execution.
 *
 * @param route - The route object from the API or SDK.
 * @param userAddress - The user's address (sender/receiver).
 * @param integratorAddress - The integrator address for the transaction.
 * @param feeBps - The fee basis points for the transaction.
 * @returns IPrepareTransactionArgsReturnType with txName, args, isFromNativeToken, and fromAmount.
 */
export function getPreparedTxArgs(
	route: IRouteType,
	userAddress: Address,
	integratorAddress: Address,
	feeBps: bigint,
): IPrepareTransactionArgsReturnType {
	const routeData = buildRouteData(route, userAddress)
	const firstSwapStep = route.steps.find(
		s => s.type === StepType.SRC_SWAP || s.type === StepType.BRIDGE,
	) as IRouteStep
	return prepareTxArgs(routeData, userAddress, firstSwapStep, integratorAddress, feeBps)
}

/**
 * Creates a state override for ERC20 allowance for gas estimation.
 *
 * @param token - ERC20 token address
 * @param owner - Token owner address
 * @param spender - Spender/contract address
 * @param amount - Allowance value to set
 * @param client - Public client (viem)
 * @returns StateOverride for use in gas estimation
 */

export type AllowanceAccessListEntry = {
	address: Address
	storageKeys: ReadonlyArray<Hex>
}
export type AllowanceAccessListResult = {
	accessList: ReadonlyArray<AllowanceAccessListEntry>
}
export type AllowanceOverrideClient = {
	createAccessList: (params: { to: Address; data: Hex }) => Promise<AllowanceAccessListResult>
}

export async function makeAllowanceOverride(
	token: Address,
	owner: Address,
	spender: Address,
	amount: bigint,
	client: AllowanceOverrideClient,
): Promise<StateOverride> {
	const balData = encodeFunctionData({ abi: erc20Abi, functionName: 'balanceOf', args: [owner] })
	const allowData = encodeFunctionData({ abi: erc20Abi, functionName: 'allowance', args: [owner, spender] })

	const [balList, allowList] = await Promise.all([
		client.createAccessList({ to: token, data: balData }),
		client.createAccessList({ to: token, data: allowData }),
	])

	const tokenLower = token.toLowerCase()
	const balArr = Array.from(balList.accessList)
	const allowArr = Array.from(allowList.accessList)

	const balEntry = balArr.find(e => e.address.toLowerCase() === tokenLower)
	const allowEntry = allowArr.find(e => e.address.toLowerCase() === tokenLower)

	if (!balEntry || !allowEntry) {
		throw new Error('Access list missing token entry')
	}

	const allowanceSlots = Array.from(allowEntry.storageKeys).filter(
		slot => !Array.from(balEntry.storageKeys).includes(slot),
	)

	if (allowanceSlots.length === 0) {
		throw new Error('No allowance storage key found')
	}

	const encodedAmount = encodeAbiParameters(parseAbiParameters('uint256'), [amount]) as Hex
	const stateDiff = allowanceSlots.map(slot => ({ slot, value: encodedAmount }))

	return [{ address: token, stateDiff }]
}
