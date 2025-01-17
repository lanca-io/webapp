import { TokenArea } from '../TokenArea/TokenArea'
import { handleWithdrawal } from '../poolExecution/withdrawal'
import { handleDeposit } from '../poolExecution/deposit'
import { getWalletClient } from '../../../../../web3/wagmi'
import { Separator } from '../../../../layout/Separator/Separator'
import { SwapDetails } from '../SwapDetails/SwapDetails'
import { IconButton } from '../../../../layout/buttons/IconButton/IconButton'
import { Dropdown } from '../SwapDetails/Dropdown/Dropdown'
import { TrailArrowLeftIcon } from '../../../../../assets/icons/TrailArrowLeftIcon'
import { ErrorType } from '../../../config/errors/ErrorType'
import { type PoolAction, type PoolState, PoolActionType } from '../poolReducer/types'
import type { Dispatch, MouseEvent } from 'react'
import { Button } from '../../../../layout/buttons/Button/Button'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import classNames from './SwapInput.module.pcss'

export interface SwapInputProps {
	poolState: PoolState
	poolDispatch: Dispatch<PoolAction>
	onClose: (e: MouseEvent<HTMLButtonElement>) => void
}

export const SwapInput = ({ poolState, poolDispatch, onClose }: SwapInputProps) => {
	const { inputError, from, to, poolMode, isLoading, balance, stage } = poolState
	const { isConnected } = useAccount()
	const { open } = useAppKit()

	const amountIsAvailable = Number(from.amount) >= 100

	const isDeposit = poolMode === 'deposit'
	const actionText: string = isDeposit ? 'Request Deposit' : 'Request Withdrawal'
	const isDisabled: boolean = (isDeposit && !amountIsAvailable) || !isConnected

	const handleStartTx = async () => {
		const walletClient = await getWalletClient(Number(from.chain.id))
		if (from.amount.length === 0) {
			poolDispatch({ type: PoolActionType.SET_INPUT_ERROR, payload: ErrorType.ENTER_AMOUNT })
			return
		}

		if (isDeposit) {
			await handleDeposit(poolState, poolDispatch, walletClient)
		} else {
			await handleWithdrawal(poolState, poolDispatch, walletClient)
		}
	}

	const tokenArea = (
		<div className={classNames.tokenAreasContainer}>
			<TokenArea
				isLoading={isLoading}
				direction="from"
				selection={from}
				poolDispatch={poolDispatch}
				balance={balance}
				stage={stage}
				error={inputError}
			/>
			<Separator />

			<TokenArea direction="to" selection={to} poolDispatch={poolDispatch} isLoading={isLoading} stage={stage} />
			<Separator />
		</div>
	)

	return (
		<div>
			<div className={classNames.header}>
				<IconButton onClick={onClose} className={classNames.close} variant="secondary" size="sm">
					<TrailArrowLeftIcon />
				</IconButton>
				<h4>{poolMode === 'deposit' ? 'Deposit' : 'Withdrawal'}</h4>
			</div>

			{tokenArea}

			<SwapDetails poolState={poolState} poolDispatch={poolDispatch} />

			<Button
				isFull
				size="lg"
				variant="primary"
				isLoading={isLoading}
				onClick={
					isConnected
						? async () => {
								await handleStartTx()
							}
						: async () => {
								await open()
							}
				}
				isDisabled={isDisabled}
			>
				{isConnected ? actionText : 'Connect Wallet'}
			</Button>

			{inputError && amountIsAvailable && (
				<div className={classNames.feeDetails}>
					<Dropdown />
				</div>
			)}
		</div>
	)
}
