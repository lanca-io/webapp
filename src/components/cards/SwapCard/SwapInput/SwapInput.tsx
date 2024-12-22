import { TokenArea } from '../TokenArea/TokenArea'
import { SwapDetails } from '../SwapDetails/SwapDetails'
import classNames from './SwapInput.module.pcss'
import { type SwapInputProps } from './types'
import { SwapButton } from '../SwapButton/SwapButton'
import { SwapIcon } from '../../../../assets/icons/SwapIcon'
import { IconButton } from '../../../layout/buttons/IconButton/IconButton'
import { FeeDropdown } from '../SwapDetails/FeeDropdown/FeeDropdown'
import { Separator } from '../../../layout/Separator/Separator'
import { getWalletClient } from '@wagmi/core'
import { config } from '../../../../web3/wagmi'
import { SwapActionType } from '../swapReducer/types'
import { handleSwap } from '../swapExecution/handleSwap'

export const SwapInput = ({ swapState, swapDispatch }: SwapInputProps) => {
	const handleSwapButtonClick = async () => {
		try {
			const walletClient = await getWalletClient(config, { chainId: Number(swapState.from.chain.id) })
			await handleSwap({
				swapState,
				swapDispatch,
				walletClient,
			})
		} catch (error) {
			console.error('Error initializing swap:', error)
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
					swapDispatch({ type: SwapActionType.SWAP_DIRECTIONS })
				}}
			>
				<SwapIcon />
			</IconButton>
			<div className={classNames.separator}></div>
		</div>
	)

	const tokenArea = (
		<div className={classNames.tokenAreasContainer}>
			<TokenArea
				direction="from"
				selection={swapState.from}
				swapDispatch={swapDispatch}
				balance={swapState.balance}
				stage={swapState.stage}
				error={swapState.inputError}
				route={swapState.selectedRoute}
			/>

			{switchDirectionButton}

			<TokenArea
				direction="to"
				selection={swapState.to}
				swapDispatch={swapDispatch}
				isLoading={swapState.isLoading}
				stage={swapState.stage}
				route={swapState.selectedRoute}
			/>

			<Separator />
		</div>
	)

	return (
		<div className={classNames.container}>
			{tokenArea}

			<SwapDetails swapState={swapState} swapDispatch={swapDispatch} />

			<SwapButton isLoading={swapState.isLoading} error={swapState.inputError} onClick={handleSwapButtonClick} />

			{swapState.selectedRoute && (
				<div className={classNames.feeDetails}>
					<FeeDropdown route={swapState.selectedRoute} />
				</div>
			)}
		</div>
	)
}
