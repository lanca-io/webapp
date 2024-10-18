import { TokenArea } from '../TokenArea/TokenArea'
import { SwapDetails } from '../SwapDetails/SwapDetails'
import classNames from './SwapInput.module.pcss'
import { type SwapInputProps } from './types'
import { SwapButton } from '../SwapButton/SwapButton'
import { handleSwap } from '../swapExecution/handleSwap'
import { SwapIcon } from '../../../../assets/icons/SwapIcon'
import { IconButton } from '../../../layout/buttons/IconButton/IconButton'
import { FeeDetailsDropdown } from '../SwapDetails/FeeDetailsDropdown/FeeDetailsDropdown'
import { Separator } from '../../../layout/Separator/Separator'

export const SwapInput = ({ swapState, swapDispatch }: SwapInputProps) => {
	const handleSwapButtonClick = async () => {
		await handleSwap({
			swapState,
			swapDispatch,
		})
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

	const tokenArea = (
		<div className={classNames.tokenAreasContainer}>
			<TokenArea
				direction="from"
				selection={swapState.from}
				swapDispatch={swapDispatch}
				balance={swapState.balance}
				stage={swapState.stage}
				error={swapState.inputError}
			/>

			{switchDirectionButton}

			<TokenArea
				direction="to"
				selection={swapState.to}
				swapDispatch={swapDispatch}
				isLoading={swapState.isLoading}
				stage={swapState.stage}
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
					<FeeDetailsDropdown route={swapState.selectedRoute} />
				</div>
			)}
		</div>
	)
}
