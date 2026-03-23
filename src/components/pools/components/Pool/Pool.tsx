import { useRef, useState, useCallback, useMemo } from 'react'
import { usePoolReducer } from './poolReducer/poolReducer'
import { Modal } from '../../../modals/Modal/Modal'
import { usePoolCardEffects } from './usePoolCardEffects'
import { SwapInput } from './SwapInput/SwapInput'
import { SwapProgress } from './SwapProgress/SwapProgress'
import { PoolActionType, PoolCardStage } from './poolReducer/types'
import { Button as CustomButton } from '../../../layout/buttons/Button/Button'
import { useAccount } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { TooltipWrapper } from '../../../wrappers/WithTooltip/TooltipWrapper'
import { LancaSwap } from './Popups/LancaSwap/LancaSwap'
import classNames from './Pool.module.pcss'
import { Button } from '@concero/ui-kit'
import { LPStreak } from './Popups/LPStreak/LPStreak'

interface Props {
	isDepositOnly?: boolean
	isWithdrawOnly?: boolean
	depositButtonClasses?: string
	withdrawalButtonClasses?: string
	poolIsFilled?: boolean
	userHasDeposited?: boolean
}

const poolDescription = 'The pool has reached its max capacity and you cannot deposit money into it.'

export const PoolCard = ({
	isDepositOnly = false,
	isWithdrawOnly = false,
	depositButtonClasses,
	withdrawalButtonClasses,
	poolIsFilled,
	userHasDeposited,
}: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [poolState, poolDispatch] = usePoolReducer()
	const { address, isConnected } = useAccount()
	const { open } = useAppKit()

	const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>()
	const isInputStages = poolState.stage === PoolCardStage.input || poolState.stage === PoolCardStage.review

	const handleGoBack = useCallback(() => {
		poolDispatch({ type: PoolActionType.RESET_AMOUNTS, direction: 'from' })
		poolDispatch({ type: PoolActionType.RESET_AMOUNTS, direction: 'to' })
		poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.input })
		poolDispatch({ type: PoolActionType.SET_SWAP_STEPS, payload: [] })
	}, [poolDispatch])

	usePoolCardEffects({ poolState, poolDispatch, address, typingTimeoutRef })

	const handleClose = useCallback(() => {
		handleGoBack()
		setIsOpen(false)
	}, [handleGoBack])

	const disabledDepositButton = useMemo(
		() => (
			<TooltipWrapper
				className={classNames.tooltip}
				tooltipId={'deposit-button'}
				tooltipContent={
					<div className="gap-xs">
						<h6>Pool is filled</h6>
						<p>{poolDescription}</p>
					</div>
				}
			>
				<CustomButton className={depositButtonClasses} isFull isDisabled={true} size="lg">
					Deposit
				</CustomButton>
			</TooltipWrapper>
		),
		[depositButtonClasses],
	)

	const depositButton = useMemo(() => {
		if (poolIsFilled) {
			return isConnected ? (
				disabledDepositButton
			) : (
				<CustomButton
					isDisabled={true}
					className={depositButtonClasses}
					onClick={async () => {
						await open()
					}}
					size="lg"
				>
					Connect wallet
				</CustomButton>
			)
		}

		return (
			<CustomButton
				isDisabled={true}
				className={depositButtonClasses}
				size="lg"
				isFull
				onClick={() => {
					poolDispatch({ type: PoolActionType.TOGGLE_POOL_MODE, payload: 'deposit' })
					setIsOpen(true)
				}}
			>
				Deposit
			</CustomButton>
		)
	}, [poolIsFilled, isConnected, depositButtonClasses, disabledDepositButton, open, poolDispatch])

	const withdrawalButton = useMemo(() => {
		if (!isConnected) {
			return (
				<Button
					className={withdrawalButtonClasses}
					onClick={async () => {
						await open()
					}}
					variant="primary"
				>
					Connect Wallet
				</Button>
			)
		}

		return (
			<Button
				className={withdrawalButtonClasses}
				onClick={() => {
					poolDispatch({ type: PoolActionType.TOGGLE_POOL_MODE, payload: 'withdraw' })
					setIsOpen(true)
				}}
				variant="primary"
			>
				Withdraw Liquidity
			</Button>
		)
	}, [address, userHasDeposited, isConnected, withdrawalButtonClasses, open, poolDispatch])

	const showPopup = useMemo(() => {
		if (poolState.stage === PoolCardStage.input && poolState.poolMode === 'deposit' && poolState.inputError === 2) {
			return <LancaSwap />
		} else if (poolState.stage === PoolCardStage.success && poolState.poolMode === 'deposit') {
			return <LPStreak />
		}
		return null
	}, [poolState.stage, poolState.poolMode, poolState.inputError])

	return (
		<>
			{isWithdrawOnly ? (
				withdrawalButton
			) : isDepositOnly ? (
				depositButton
			) : (
				<div className={classNames.buttons}>
					{depositButton}
					{withdrawalButton}
				</div>
			)}

			<Modal
				position="top"
				className={classNames.container}
				isHeaderVisible={false}
				show={isOpen}
				setShow={handleClose}
				popup={showPopup}
			>
				{isInputStages ? (
					<SwapInput onClose={handleClose} poolState={poolState} poolDispatch={poolDispatch} />
				) : (
					<SwapProgress poolState={poolState} poolDispatch={poolDispatch} handleGoBack={handleGoBack} />
				)}
			</Modal>
		</>
	)
}
