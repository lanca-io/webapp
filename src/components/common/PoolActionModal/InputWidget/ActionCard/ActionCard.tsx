import type { FC } from 'react'
import { Button } from '@concero/ui-kit'
import { PoolsActionType } from '../../Reducer/types'
import { useInputWidgetContext } from '../Reducer/Provider'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { useActionExecution } from '../useActionExecution'
import { useAppKitNetwork } from '@reown/appkit/react'
import { POOLS_CHAIN_ID } from '@/configuration/pools'
import { useSwitchChain } from '@/hooks/useSwitchChain'
import './ActionCard.pcss'

type ActionCardProps = {
	type: PoolsActionType
}

export const ActionCard: FC<ActionCardProps> = ({ type }) => {
	const { state: inputState } = useInputWidgetContext()
	const { dispatch: poolsDispatch } = usePoolsActionContext()
	const { execute } = useActionExecution(
		inputState.rawInput,
		poolsDispatch,
		type,
	)
	const { chainId } = useAppKitNetwork()
	const { switchChain } = useSwitchChain()

	const isWarning = !!inputState.warning
	const isError = !!inputState.error
	const isDisabled =
		isWarning || isError || !inputState.input || inputState.rawInput === 0n
	const isWrongChain = chainId !== POOLS_CHAIN_ID

	const onAction = async () => {
		try {
			if (isWrongChain) {
				await switchChain(POOLS_CHAIN_ID)
			} else {
				await execute()
			}
		} catch (error) {
			console.error('Action failed:', error)
		}
	}

	const buttonText = isWrongChain
		? 'Switch Chain'
		: type === PoolsActionType.Deposit
			? 'Deposit'
			: 'Withdraw'

	return (
		<div className="pool_action_action_card">
			<Button
				variant="primary"
				size="l"
				isFull
				isDisabled={isDisabled}
				onClick={onAction}
			>
				{buttonText}
			</Button>
		</div>
	)
}
