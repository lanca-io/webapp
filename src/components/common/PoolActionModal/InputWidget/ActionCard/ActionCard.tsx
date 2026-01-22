import type { FC } from 'react'
import type { Address } from 'viem'
import { Button } from '@concero/ui-kit'
import { PoolsActionType } from '../../Reducer/types'
import { useInputWidgetContext } from '../Reducer/Provider'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { getWalletClient } from '@/providers/Web3Provider/Web3Provider'
import { handleDeposit } from '@/handlers/deposit'
import { handleWithdrawal } from '@/handlers/withdrawal'
import './ActionCard.pcss'

const CHAIN_ID = 421614
const USDC_ADDRESS: Address = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'
const LP_TOKEN_ADDRESS: Address = '0x4aABa0D6A62B9f35BA6B32f159f921a809B7b316'
const POOL_ADDRESS: Address = '0x3539E43970cc7A73E0618a2fB335326ffACCD82C'

type ActionCardProps = {
	type: PoolsActionType
}

export const ActionCard: FC<ActionCardProps> = ({ type }) => {
	const { state: inputState } = useInputWidgetContext()
	const { dispatch: poolsDispatch } = usePoolsActionContext()

	const isWarning = !!inputState.warning
	const isError = !!inputState.error
	const isDisabled =
		isWarning || isError || !inputState.input || inputState.rawInput === 0n

	const onAction = async () => {
		try {
			const client = await getWalletClient(CHAIN_ID)

			if (type === PoolsActionType.DEPOSIT) {
				await handleDeposit(
					client,
					CHAIN_ID,
					POOL_ADDRESS,
					USDC_ADDRESS,
					inputState.rawInput,
					poolsDispatch,
				)
			} else {
				await handleWithdrawal(
					client,
					CHAIN_ID,
					POOL_ADDRESS,
					LP_TOKEN_ADDRESS,
					inputState.rawInput,
					poolsDispatch,
				)
			}
		} catch (e) {
			console.error('Action failed:', e)
		}
	}

	return (
		<div className="pool_action_action_card">
			<Button
				variant="primary"
				size="l"
				isFull
				isDisabled={isDisabled}
				onClick={onAction}
			>
				{type === PoolsActionType.DEPOSIT ? 'Deposit' : 'Withdraw'}
			</Button>
		</div>
	)
}
