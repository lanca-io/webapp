import { TokenArea } from '../TokenArea/TokenArea'
import { handleWithdrawal } from '../poolExecution/withdrawal'
import { handleDeposit } from '../poolExecution/deposit'
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
import { useAccount, useWalletClient } from 'wagmi'
import classNames from './SwapInput.module.pcss'

export interface SwapInputProps {
	poolState: PoolState
	poolDispatch: Dispatch<PoolAction>
	onClose: (e: MouseEvent<HTMLButtonElement>) => void
}

export const SwapInput = ({ poolState, poolDispatch, onClose }: SwapInputProps) => {
	const { inputError, from, to, poolMode, isLoading, balance, stage } = poolState
	const { isConnected } = useAccount()
	const { data: client } = useWalletClient()
	const { open } = useAppKit()

	const amountIsAvailable = Number(from.amount) >= 250

	const isDeposit = poolMode === 'deposit'
	const actionText: string = isDeposit ? 'Request Deposit' : 'Request Withdrawal'
	const isDisabled: boolean = (isDeposit && !amountIsAvailable) || !isConnected

	const handleStartTx = async () => {
		await client?.switchChain({ id: Number(from.chain.id) })
		if (from.amount.length === 0) {
			poolDispatch({ type: PoolActionType.SET_INPUT_ERROR, payload: ErrorType.ENTER_AMOUNT })
			return
		}

		if (isDeposit && client) {
			await handleDeposit(poolState, poolDispatch, client)
		} else if (!isDeposit && client) {
			await handleWithdrawal(poolState, poolDispatch, client)
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
				<IconButton onClick={onClose} className={classNames.close} variant="secondary" size="md">
					<TrailArrowLeftIcon />
				</IconButton>
				<h4>{poolMode === 'deposit' ? 'Deposit' : 'Withdrawal'}</h4>
			</div>

			{tokenArea}

			<SwapDetails poolState={poolState} poolDispatch={poolDispatch} />

			<Button
				isFull
				size="md"
				variant="primary"
				isLoading={isLoading}
				className={classNames.actionButton}
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
