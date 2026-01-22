import { useCallback } from 'react'
import { useInputWidgetContext } from './Reducer/Provider'
import { InputActionType } from './Reducer/types'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { usePoolsUserBalancesStore } from '@/store/pools-user-balances/usePoolsUserBalancesStore'
import { formatUnits } from 'viem'

export const useActionValidation = (type: PoolsExecutionType) => {
	const { state, dispatch } = useInputWidgetContext()
	const { tvl, cap } = usePoolsDataStore()
	const { rawUsd, rawLp } = usePoolsUserBalancesStore()
	const balance = type === PoolsExecutionType.DEPOSIT ? rawUsd : rawLp

	const checkCap = useCallback(() => {
		if (!cap || !tvl) return false
		if (type === PoolsExecutionType.WITHDRAWAL) return false

		const inputDollars = Number(formatUnits(state.rawInput, 6))
		if (Number(tvl) + inputDollars > Number(cap)) {
			dispatch({
				type: InputActionType.SET_WARNING,
				payload: `Pools can only accept up to $${Number(cap - tvl).toFixed(2)}`,
			})
			return true
		}
		return false
	}, [dispatch, type, cap, tvl, state.rawInput])

	const checkBalance = useCallback(() => {
		if (balance === null || balance === undefined) return false
		if (state.rawInput > balance) {
			dispatch({
				type: InputActionType.SET_ERROR,
				payload: `You do not have enough ${type === PoolsExecutionType.DEPOSIT ? 'USDC' : 'CLP'} on Arbitrum`,
			})
			return true
		}
		return false
	}, [dispatch, state.rawInput, balance, type])

	const checkMinDeposit = useCallback(() => {
		if (type !== PoolsExecutionType.DEPOSIT) return false

		const inputDollars = Number(formatUnits(state.rawInput, 6))
		if (inputDollars < 100 && inputDollars > 0) {
			dispatch({
				type: InputActionType.SET_ERROR,
				payload: `Minimum amount is $100 USDC`,
			})
			return true
		}
		return false
	}, [dispatch, state.rawInput, type])

	const clearValidations = useCallback(() => {
		dispatch({ type: InputActionType.CLEAR_ERROR })
		dispatch({ type: InputActionType.CLEAR_WARNING })
	}, [dispatch])

	const validate = useCallback(() => {
		if (!state.isTouched || state.rawInput === 0n) return

		if (checkCap()) return
		if (checkBalance()) return
		if (checkMinDeposit()) return

		clearValidations()
	}, [
		state.isTouched,
		state.rawInput,
		checkCap,
		checkBalance,
		checkMinDeposit,
		clearValidations,
	])

	return { validate, checkCap, checkBalance, checkMinDeposit, clearValidations }
}
