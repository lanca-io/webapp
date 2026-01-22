import { useCallback } from 'react'
import { useInputWidgetContext } from './Reducer/Provider'
import { InputActionType } from './Reducer/types'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'

export const useActionValidation = (type: PoolsExecutionType) => {
	const { state, dispatch } = useInputWidgetContext()
	const { tvl, cap } = usePoolsDataStore()
	// const { usd, lp } = usePoolsUserBalancesStore()

	// const balance = type === PoolsExecutionType.DEPOSIT ? usd : lp

	const checkCap = useCallback(() => {
		console.log('🔍 checkCap ENTER:', {
			capExists: !!cap,
			tvlExists: !!tvl,
			type,
			stateInput: state.input,
			rawInput: state.rawInput.toString(),
			tvlValue: tvl?.toString(),
			capValue: cap?.toString(),
		})

		if (!cap || !tvl) {
			console.log('⏭️ checkCap: missing cap OR tvl → return false')
			return false
		}

		console.log('🔍 checkCap: cap/tvl exist, checking type...')
		if (type === PoolsExecutionType.WITHDRAWAL) {
			console.log('⏭️ checkCap: WITHDRAWAL → return false')
			return false
		}

		console.log('🔍 checkCap: DEPOSIT, computing tvl + input...')
		// ❌ PROBLEM: Number(state.input) loses precision + crashes on empty!
		const inputNum = Number(state.input)
		const newTvlNum = Number(tvl) + inputNum
		console.log('🔍 checkCap math:', {
			inputNum,
			tvlNum: Number(tvl),
			newTvlNum,
			capNum: Number(cap),
			exceeds: newTvlNum > Number(cap),
		})

		if (newTvlNum > Number(cap)) {
			console.log('❌ checkCap: EXCEEDS → SET_WARNING')
			dispatch({
				type: InputActionType.SET_WARNING,
				payload: `Pools can only accept up to $${(Number(cap) - Number(tvl)).toFixed(2)}`,
			})
			console.log('✅ checkCap: dispatched SET_WARNING → return true')
			return true
		}

		console.log('✅ checkCap: PASSED → return false')
		return false
	}, [dispatch, type, cap, tvl, state.rawInput])

	// const checkBalance = useCallback(() => {
	//     if (!balance) return false
	//     if (state.rawInput > balance) {
	//         dispatch({
	//             type: InputActionType.SET_ERROR,
	//             payload: `Insufficient balance. Available: ${formatUnits(balance, 6)}`
	//         })
	//         return true
	//     }
	//     return false
	// }, [dispatch, state.rawInput, balance])

	// const checkTvlWarning = useCallback(() => {
	//     if (!tvl || type !== PoolsExecutionType.DEPOSIT || state.rawInput * 10n <= tvl) {
	//         dispatch({ type: InputActionType.CLEAR_WARNING })
	//         return
	//     }
	//     dispatch({
	//         type: InputActionType.SET_WARNING,
	//         payload: `Large deposit: Increases TVL ${((state.rawInput * 100n / (tvl + state.rawInput)).toString())}%`
	//     })
	// }, [dispatch, type, tvl, state.rawInput])

	const clearValidations = useCallback(() => {
		dispatch({ type: InputActionType.CLEAR_ERROR })
		dispatch({ type: InputActionType.CLEAR_WARNING })
	}, [dispatch])

	const validate = useCallback(() => {
		console.log('Validating input...', state.input)
		if (!state.isTouched || state.rawInput === 0n) return
		console.log('Input is touched and non-zero, proceeding with validations.')

		if (checkCap()) return
		// if (checkBalance()) return

		// checkTvlWarning()
		clearValidations()
	}, [state.isTouched, state.rawInput, checkCap, clearValidations])

	return { validate, checkCap, clearValidations }
}
