import { type Address } from 'viem'
import { useCallback, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { useLancaSDK } from '../providers/SDKProvider/useLancaSDK'
import { useFormStore } from '../store/form/useFormStore'
import { useSettingsStore } from '../store/settings/useSettings'
import { useSubvariantStore } from '../store/subvariant/useSubvariantStore'
import { SplitSubvariantType } from '../store/subvariant/types'

export const useGetExectionRoute = () => {
	const { address } = useAccount()
	const { state } = useSubvariantStore()
	const { fromChain, toChain, fromToken, toToken, fromAmount, amountInputError, addressInputError, toAddress } =
		useFormStore()
	const { slippage } = useSettingsStore()
	const sdk = useLancaSDK()

	const [isLoading, setIsLoading] = useState<boolean>(false)

	const effectiveToAddress = useMemo(() => {
		if (state === SplitSubvariantType.SEND) {
			if (toAddress && !addressInputError) return toAddress
			return address as Address
		}
		return address as Address
	}, [state, toAddress, address, addressInputError])

	const parameters = useMemo(
		() => ({
			fromChainId: fromChain?.id,
			toChainId: toChain?.id,
			fromToken: fromToken?.address,
			toToken: toToken?.address,
			fromAmount,
			slippage,
			effectiveToAddress,
		}),
		[fromChain?.id, toChain?.id, fromToken?.address, toToken?.address, fromAmount, slippage, effectiveToAddress],
	)

	const canFetch = useMemo(() => {
		const isValidAmount = Boolean(fromAmount && Number(fromAmount) > 0 && !amountInputError)

		return Boolean(
			isValidAmount &&
				parameters.fromChainId &&
				parameters.toChainId &&
				parameters.fromToken &&
				parameters.toToken,
		)
	}, [parameters, amountInputError])

	const fetchRoute = useCallback(async () => {
		if (!canFetch || !fromAmount) {
			throw new Error('Missing required parameters for route calculation')
		}

		setIsLoading(true)
		try {
			const route = await sdk.getRoute({
				fromChainId: parameters.fromChainId!,
				toChainId: parameters.toChainId!,
				fromToken: parameters.fromToken! as Address,
				toToken: parameters.toToken! as Address,
				amount: fromAmount,
				fromAddress: address as Address,
				toAddress: effectiveToAddress,
				slippageTolerance: slippage,
			})
			return route
		} finally {
			setIsLoading(false)
		}
	}, [sdk, canFetch, parameters, address, effectiveToAddress, slippage, fromAmount])

	return {
		fetchRoute,
		isLoading,
	}
}
