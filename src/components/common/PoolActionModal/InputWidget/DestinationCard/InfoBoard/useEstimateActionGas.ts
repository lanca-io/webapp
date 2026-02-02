import type { Address, Client, PublicClient } from 'viem'
import { erc20Abi, zeroAddress } from 'viem'
import { usePoolsActionContext } from '../../../Reducer/Provider'
import { useInputWidgetContext } from '../../Reducer/Provider'
import { PoolsActionType } from '../../../Reducer/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
	PARENT_POOL_ADDRESS,
	POOLS_CHAIN_ID,
	POOLS_LP_TOKEN_ADDRESS,
	POOLS_USDC_ADDRESS,
} from '@/configuration/pools'
import { AllowanceOverrideClient, makeAllowanceOverride } from '@/utils/args'
import { getPublicClient } from '@/providers/Web3Provider/Web3Provider'
import { estimateContractGas } from 'viem/actions'
import { poolsAbi } from '@/abi/PoolsAbi'
import { useAccount } from 'wagmi'
import { handleFetchTokens } from '@/handlers/tokens'

type GasEstimation = {
	wei: bigint
	usd: number
}

async function getNativeTokenUsdPrice(chainId: string): Promise<number | null> {
	try {
		const response = await handleFetchTokens(
			chainId,
			0,
			1,
			undefined,
			zeroAddress as Address,
		)
		return response?.[0]?.price_usd ? Number(response[0].price_usd) : null
	} catch {
		return null
	}
}

export const useEstimateActionGas = () => {
	const [estimate, setEstimate] = useState<GasEstimation | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const { address } = useAccount()
	const { state: poolsState } = usePoolsActionContext()
	const { state: inputState } = useInputWidgetContext()

	const isDeposit = poolsState.type === PoolsActionType.Deposit
	const token = isDeposit ? POOLS_USDC_ADDRESS : POOLS_LP_TOKEN_ADDRESS
	const amount = inputState.rawInput

	const isValid = useMemo(
		() =>
			inputState.isValid === true &&
			!inputState.error &&
			!inputState.warning &&
			!!address &&
			amount > 0n,
		[inputState.isValid, inputState.error, inputState.warning, address, amount],
	)

	const estimateApprovalGas = useCallback(
		async (client: Client) => {
			const gasEstimate = await estimateContractGas(client, {
				account: address,
				address: token,
				abi: erc20Abi,
				functionName: 'approve',
				args: [PARENT_POOL_ADDRESS, amount],
			})
			return (gasEstimate * 13n) / 10n
		},
		[address, token, amount],
	)

	const estimateQueueGas = useCallback(
		async (client: PublicClient) => {
			const stateOverride = await makeAllowanceOverride(
				token,
				address as Address,
				PARENT_POOL_ADDRESS,
				amount,
				client as unknown as AllowanceOverrideClient,
			)

			const gasEstimate = await estimateContractGas(client, {
				account: address!,
				address: PARENT_POOL_ADDRESS,
				abi: poolsAbi,
				functionName: isDeposit ? 'enterDepositQueue' : 'enterWithdrawalQueue',
				args: [amount],
				stateOverride,
			})
			return (gasEstimate * 13n) / 10n
		},
		[address, token, amount, isDeposit],
	)

	const estimateGas = useCallback(async () => {
		if (!isValid) {
			setEstimate(null)
			setIsLoading(false)
			setError(null)
			return
		}

		const client = getPublicClient(POOLS_CHAIN_ID) as PublicClient | null
		if (!client) {
			setEstimate(null)
			setIsLoading(false)
			setError('Missing public client')
			return
		}

		setIsLoading(true)
		setError(null)
		setEstimate(null)

		try {
			const [approvalGas, queueGas] = await Promise.all([
				estimateApprovalGas(client),
				estimateQueueGas(client),
			])
			const totalGas = approvalGas + queueGas

			const [usdPrice, gasPrice] = await Promise.all([
				getNativeTokenUsdPrice(String(42161)),
				client.getGasPrice(),
			])

			if (!usdPrice) {
				throw new Error('Missing USD price for gas estimation')
			}

			const usdEstimate = (Number(totalGas * gasPrice) / 1e18) * usdPrice

			if (!usdEstimate || usdEstimate <= 0) {
				throw new Error('Invalid gas estimate')
			}

			setEstimate({ wei: totalGas, usd: usdEstimate })
		} catch (err) {
			setEstimate(null)
			setError(err instanceof Error ? err.message : 'Failed to estimate gas')
		} finally {
			setIsLoading(false)
		}
	}, [isValid, estimateApprovalGas, estimateQueueGas])

	useEffect(() => {
		estimateGas()
	}, [estimateGas])

	return { estimate, isLoading, error }
}
