import { useAccount, useSwitchChain, useWalletClient } from 'wagmi'
import { TokenArea } from '../TokenArea/TokenArea'
import { SwapDetails } from '../SwapDetails/SwapDetails'
import classNames from './SwapInput.module.pcss'
import { type SwapInputProps } from './types'
import { SwapButton } from '../SwapButton/SwapButton'
import { getEthersSigner } from '../../../../web3/ethers'
import { type providers } from 'ethers'
import { SwapCardStage } from '../swapReducer/types'
import { handleSwap } from '../swapExecution/handleSwap'
import { useContext } from 'react'
import { type DataContextValue } from '../../../../hooks/DataContext/types'
import { DataContext } from '../../../../hooks/DataContext/DataContext'
import { SwapIcon } from '../../../../assets/icons/SwapIcon'
import { IconButton } from '../../../buttons/IconButton/IconButton'
import { FeeDetailsDropdown } from '../SwapDetails/FeeDetailsDropdown/FeeDetailsDropdown'

export const SwapInput = ({ swapState, swapDispatch, isNewSwapCardMode = true }: SwapInputProps) => {
	const { getChainByProviderSymbol } = useContext<DataContextValue>(DataContext)
	const { isConnected, address } = useAccount()

	const walletClient = useWalletClient()
	const { switchChainAsync } = useSwitchChain()

	async function switchChainHook(requiredChainId: number) {
		if (!walletClient.data) {
			throw new Error('Wallet client data is not available')
		}

		const currentChainId = walletClient.data.chain.id

		if (currentChainId !== requiredChainId) {
			if (switchChainAsync) {
				const chain = await switchChainAsync({ chainId: requiredChainId })
				if (!chain) throw new Error('Failed to switch to the required network')
			} else {
				throw new Error('switchNetworkAsync is not available')
			}
		}
	}

	async function getSigner(): Promise<providers.JsonRpcSigner> {
		const currentChainId = walletClient.data?.chain.id
		if (currentChainId) {
			return (await getEthersSigner(currentChainId)) as providers.JsonRpcSigner
		} else {
			throw new Error('Failed to get signer')
		}
	}

	const handleSwapButtonClick = async () => {
		if (swapState.stage === 'input') {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.review })
		} else {
			await handleSwap({
				swapState,
				swapDispatch,
				address,
				switchChainHook,
				getChainByProviderSymbol,
				getSigner,
				isNewSwapCardMode,
			})
		}
	}

	const switchDirectionButton = (
		<div className={classNames.separatorWrap}>
			<div className={classNames.separator}></div>
			<IconButton
				size="sm"
				variant="secondary"
				className={classNames.arrowsIcon}
				onClick={() => {
					swapDispatch({ type: 'SWAP_DIRECTIONS' })
				}}
			>
				<SwapIcon />
			</IconButton>
			<div className={classNames.separator}></div>
		</div>
	)

	return (
		<div className={classNames.container}>
			<div className={classNames.tokenAreasContainer}>
				<TokenArea
					direction="from"
					selection={swapState.from}
					swapDispatch={swapDispatch}
					balance={swapState.balance}
					stage={swapState.stage}
				/>

				{switchDirectionButton}

				<TokenArea
					direction="to"
					selection={swapState.to}
					swapDispatch={swapDispatch}
					isLoading={swapState.isLoading}
					stage={swapState.stage}
				/>

				<div className={classNames.separator}></div>
			</div>

			<SwapDetails swapState={swapState} swapDispatch={swapDispatch} />

			<SwapButton
				swapState={swapState}
				isConnected={isConnected}
				onClick={handleSwapButtonClick}
				switchChainHook={switchChainHook}
			/>

			<FeeDetailsDropdown />
		</div>
	)
}
