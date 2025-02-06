import { isFloatInput } from '../../../../../utils/validation'
import { PoolActionType, PoolCardStage, type PoolAction } from '../poolReducer/types'
import type { ForwardedRef, MutableRefObject, Dispatch } from 'react'
import { type TokenAreaState } from '../TokenArea/tokenAreaReducer/types'

export const handleAreaClick = (
	inputRef: MutableRefObject<ForwardedRef<HTMLInputElement> | HTMLInputElement | null>,
	stage: PoolCardStage,
): void => {
	if (stage === PoolCardStage.review) {
		return
	}

	const inputElement = inputRef.current as HTMLInputElement | null
	inputElement?.focus()
}

interface HandleAmountChangeProps {
	value: string
	state: TokenAreaState
	dispatch: Dispatch<PoolAction>
	direction: 'from' | 'to'
}

export const handleAmountChange = ({ value, state, dispatch, direction }: HandleAmountChangeProps): void => {
	if (value === '') {
		dispatch({
			type: PoolActionType.RESET_AMOUNTS,
			direction,
		})
		return
	}

	if (!isFloatInput(value)) return

	const amountUSD = parseFloat((state.currentTokenPriceUSD * parseFloat(value)).toFixed(2))

	dispatch({
		type: PoolActionType.SET_AMOUNT,
		direction,
		payload: { amount: value, amount_usd: amountUSD },
	})
}
