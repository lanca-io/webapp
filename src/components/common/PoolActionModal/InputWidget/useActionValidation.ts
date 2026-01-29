import { useInputWidgetContext } from './Reducer/Provider'
import { InputActionType } from './Reducer/types'
import { PoolsActionType } from '../Reducer/types'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { formatUnits } from 'viem'

export const useActionValidation = (type: PoolsActionType) => {
	const { state, dispatch } = useInputWidgetContext()
	const { tvl, cap } = usePoolsDataStore()
	const { rawUsd, rawLp } = usePoolsPositions()

	const balance = type === PoolsActionType.Deposit ? rawUsd : rawLp

	const checkCap = () => {
		if (!cap || !tvl) return false
		if (type === PoolsActionType.Withdraw) return false

		if (Number(tvl) + Number(state.input) > Number(cap)) {
			dispatch({
				type: InputActionType.SET_WARNING,
				payload: `Pools can only accept up to $${Number(cap - tvl).toFixed(2)}`,
			})
			return true
		}
		return false
	}

	const checkBalance = () => {
		if (balance === null || balance === undefined) return false
		const exceeds = state.rawInput > balance

		if (exceeds) {
			dispatch({
				type: InputActionType.SET_ERROR,
				payload: `You do not have enough ${type === PoolsActionType.Deposit ? 'USDC' : 'CLP'} on Arbitrum`,
			})
			return true
		}
		return false
	}

	const checkMinDeposit = () => {
		if (type !== PoolsActionType.Deposit) return false

		const inputDollars = Number(formatUnits(state.rawInput, 6))
		if (inputDollars < 100 && inputDollars > 0) {
			dispatch({
				type: InputActionType.SET_ERROR,
				payload: `Minimum amount is $100 USDC`,
			})
			return true
		}
		return false
	}

	const clearValidations = () => {
		dispatch({ type: InputActionType.CLEAR_ERROR })
		dispatch({ type: InputActionType.CLEAR_WARNING })
	}

	const validate = () => {
		if (state.input === '') {
			clearValidations()
			return
		}

		if (checkCap()) return
		if (checkBalance()) return
		if (checkMinDeposit()) return

		clearValidations()
	}

	return { validate, checkCap, checkBalance, checkMinDeposit, clearValidations }
}
