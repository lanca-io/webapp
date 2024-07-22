import { createPublicClient, http, parseUnits, type WalletClient } from 'viem'
import { type Route } from '../types/routeTypes'
import { type InputRouteData } from '../types/contractInputTypes'
import { viemChains } from '../configs/chainsConfig'
import { conceroAddressesMap } from '../configs/conceroAddressesMap'
import { ExecuteRouteStage, type ExecutionConfigs, type ExecutionState } from '../types/executeSettingsTypes'
import { buildRouteData } from './buildRouteData'
import { checkTransactionStatus } from './checkTransactionStatus'
import { checkAllowanceAndApprove } from './checkAllowanceAndApprove'
import { sendTransaction } from './sendTransaction'
import { trackEvent } from '../../hooks/useTracking'
import { action, category } from '../../constants/tracking'
import { unwrapWNative } from './unwrapWNative'

const useSendStateHook = (executionConfigs: ExecutionConfigs) => {
	const { executionStateUpdateHook, executeInBackground } = executionConfigs

	return (state: ExecutionState) => {
		if (!executeInBackground && executionStateUpdateHook) {
			executionStateUpdateHook(state)
		}
	}
}

const executeRouteBase = async (walletClient: WalletClient, route: Route, executionConfigs: ExecutionConfigs) => {
	if (!walletClient) throw new Error('walletClient is not passed!')

	if (!route) throw new Error('Route is not passed!')

	const { data } = route
	const { switchChainHook } = executionConfigs
	const sendState = useSendStateHook(executionConfigs)
	const containDstUnwrapWNative =
		data.steps[data.steps.length - 1].tool.additional_info?.containDstUnwrapWNative ?? false

	if (data.to.amount === '0' || data.to.amount === '') throw new Error('Amount is empty!')
	if (data.from.token.address === data.to.token.address) throw new Error('Tokens are the same!')

	sendState({
		stage: ExecuteRouteStage.setChain,
		payload: {
			title: 'Switch chain',
			body: 'Please switch chain in your wallet',
			status: 'await',
			txLink: null,
		},
	})

	if (!switchChainHook) {
		await walletClient.switchChain({ id: Number(data.from.chain.id) })
	} else {
		await switchChainHook(Number(data.from.chain.id))
	}

	sendState({
		stage: ExecuteRouteStage.setAddress,
		payload: {
			title: 'Get client address',
			body: 'Please get access to your address in your wallet',
			status: 'await',
			txLink: null,
		},
	})

	const [clientAddress] = await walletClient.requestAddresses()

	const publicClient = createPublicClient({
		chain: viemChains[data.from.chain.id].chain,
		transport: viemChains[data.from.chain.id].transport ?? http(),
	})

	const inputRouteData: InputRouteData = buildRouteData(data, clientAddress)
	const conceroAddress = conceroAddressesMap[data.from.chain.id]

	sendState({
		stage: ExecuteRouteStage.checkAllowance,
		payload: {
			title: 'Check allowance',
			body: 'Waiting for token allowance',
			status: 'await',
			txLink: null,
		},
	})

	await checkAllowanceAndApprove(walletClient, publicClient, data.from, clientAddress, sendState)
	const hash = await sendTransaction(inputRouteData, publicClient, walletClient, conceroAddress, clientAddress)
	await checkTransactionStatus(hash, publicClient, sendState, data, conceroAddress, clientAddress)
	if (containDstUnwrapWNative) {
		await unwrapWNative(
			data.to.token.chain_id,
			data.to.token.address,
			parseUnits(data.to.amount, data.to.token.decimals),
			clientAddress,
		)
	}

	return hash
}

export const executeRoute = async (walletClient: WalletClient, route: Route, executionConfigs: ExecutionConfigs) => {
	const sendState = useSendStateHook(executionConfigs)

	try {
		const txHash = await executeRouteBase(walletClient, route, executionConfigs)

		trackEvent({
			category: category.SwapCard,
			action: action.SwapSuccess,
			label: 'swap_success',
			data: { provider: 'concero', route, txHash },
		})
	} catch (error) {
		console.error(error)

		sendState({
			stage: ExecuteRouteStage.internalError,
			payload: {
				title: 'Transaction failed',
				body: 'Internal error',
				status: 'failed',
				txLink: null,
			},
		})

		if (error.toString().toLowerCase().includes('user rejected')) {
			trackEvent({
				category: category.SwapCard,
				action: action.SwapRejected,
				label: 'User rejected swap',
				data: { provider: 'concero', route },
			})
			return
		}

		const { txHash } = error.data

		trackEvent({
			category: category.SwapCard,
			action: action.SwapFailed,
			label: 'swap_failed',
			data: { provider: 'concero', route, txHash },
		})
	}
}
