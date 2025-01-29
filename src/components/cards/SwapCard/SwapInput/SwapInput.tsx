import React, { useCallback } from 'react'
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

export const SwapInput = React.memo(({ swapState, swapDispatch }: SwapInputProps) => {
	const { from, to, balance, stage, inputError, selectedRoute, isLoading } = swapState

	const handleSwapButtonClick = useCallback(async () => {
		try {
			const walletClient = await getWalletClient(config, { chainId: Number(from.chain.id) })
			await handleSwap({
				swapState,
				swapDispatch,
				walletClient,
			})
		} catch (error) {
			console.error('Error initializing swap:', error)
		}
	}, [from.chain.id, swapState, swapDispatch])

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
				selection={from}
				swapDispatch={swapDispatch}
				balance={balance}
				stage={stage}
				error={inputError}
				route={selectedRoute}
			/>

			{switchDirectionButton}

			<TokenArea
				direction="to"
				selection={to}
				swapDispatch={swapDispatch}
				isLoading={isLoading}
				stage={stage}
				route={selectedRoute}
			/>

			<Separator />
		</div>
	)

	return (
		<div>
			{tokenArea}

			<SwapDetails swapState={swapState} swapDispatch={swapDispatch} />

			<SwapButton isLoading={isLoading} error={inputError} onClick={handleSwapButtonClick} />

			{selectedRoute && (
				<div className={classNames.feeDetails}>
					<FeeDropdown route={selectedRoute} />
				</div>
			)}
		</div>
	)
})
