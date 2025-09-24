import type { Address } from 'viem'
import type { IRouteStep } from '@lanca/sdk'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { StepType } from '@lanca/sdk'
import { useRouteStore } from '../store/route/useRouteStore'
import { useAccount } from 'wagmi'
import { zeroAddress, maxUint256 } from 'viem'
import { getPublicClient } from '../configuration/chains'
import { buildRouteData, prepareTxArgs, makeAllowanceOverride } from '../utils/new/args'
import { contractAddresses } from '../configuration/addresses'
import { conceroOrchestratorAbi } from '../assets/abi/ConceroOrchestrator'
import { handleFetchTokens } from '../handlers/tokens'
import { isNative } from '@lanca/sdk'

type GasEstimation = {
	wei: bigint
	usd: number
}

async function getNativeTokenUsdPrice(chainId: string): Promise<number | null> {
	try {
		const response = await handleFetchTokens(chainId, 0, 1, undefined, zeroAddress as Address)
		return response?.[0]?.price_usd ? Number(response[0].price_usd) : null
	} catch (error) {
		return null
	}
}

export const useEstimateGas = () => {
	const { address } = useAccount()
	const { route } = useRouteStore()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)
	const [estimate, setEstimate] = useState<GasEstimation | null>(null)

	const step = useMemo(
		() => route?.steps.find(s => s.type === StepType.SRC_SWAP || s.type === StepType.BRIDGE),
		[route?.steps],
	)

	const estimateRouteGas = useCallback(async () => {
		if (!route || !address || !step) return null

		setIsLoading(true)
		setError(null)
		setEstimate(null)

		try {
			const [routeData, client, contractAddress] = await Promise.all([
				buildRouteData(route, address),
				getPublicClient(Number(route.from.chain.id)),
				contractAddresses[route.from.chain.id.toString()],
			])

			const preparedArgs = prepareTxArgs(routeData, address, step as IRouteStep, zeroAddress, 0n)

			const isERC20 = !isNative(route.from.token.address)
			const stateOverride = isERC20
				? await makeAllowanceOverride(
						route.from.token.address as Address,
						address,
						contractAddress,
						maxUint256,
						client,
					)
				: []

			const gasEstimate = await client.estimateContractGas({
				account: address,
				address: contractAddress,
				abi: conceroOrchestratorAbi,
				functionName: preparedArgs.txName,
				args: preparedArgs.args,
				value: preparedArgs.isFromNativeToken ? preparedArgs.fromAmount : 0n,
				stateOverride,
			})

			const [usdPrice, gasPrice] = await Promise.all([
				getNativeTokenUsdPrice(route.from.chain.id),
				client.getGasPrice(),
			])

			if (!usdPrice) {
				throw new Error('Missing USD price for gas estimation')
			}

			const usdEstimate = (Number(gasEstimate * gasPrice) / 1e18) * usdPrice
			if (!usdEstimate || usdEstimate <= 0) {
				throw new Error('Invalid gas estimate')
			}
			setEstimate({ wei: gasEstimate, usd: usdEstimate })
			return { wei: gasEstimate, usd: usdEstimate }
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to estimate gas')
			setEstimate(null)
			return null
		} finally {
			setIsLoading(false)
		}
	}, [route, address, step])

	useEffect(() => {
		if (route && address) {
			estimateRouteGas()
		}
	}, [route, address, estimateRouteGas])

	return {
		estimate,
		isLoading,
		error,
	}
}
