import { useInputWidgetContext } from './Reducer/Provider'
import { InputActionType } from './Reducer/types'
import { PoolsActionType } from '../Reducer/types'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { usePoolsUserBalancesStore } from '@/store/pools-user-balances/usePoolsUserBalancesStore'
import { formatUnits } from 'viem'

export const useActionValidation = (type: PoolsActionType) => {
	const { state, dispatch } = useInputWidgetContext()
	const { tvl, cap } = usePoolsDataStore()
	const { rawUsd, rawLp } = usePoolsUserBalancesStore()

	const balance = type === PoolsActionType.DEPOSIT ? rawUsd : rawLp

	console.log('useActionValidation render:', {
		type,
		stateInput: state.input,
		stateRawInput: state.rawInput.toString(),
		balance: balance?.toString?.() || 'null',
		tvl: tvl?.toString?.() || 'null',
		cap: cap?.toString?.() || 'null',
	})

	const checkCap = () => {
		console.log('🔍 checkCap called')
		if (!cap || !tvl) {
			console.log('checkCap: missing cap/tvl')
			return false
		}
		if (type === PoolsActionType.WITHDRAWAL) {
			console.log('checkCap: withdrawal skip')
			return false
		}

		const result = Number(tvl) + Number(state.input) > Number(cap)
		console.log('checkCap result:', result)
		if (result) {
			dispatch({
				type: InputActionType.SET_WARNING,
				payload: `Pools can only accept up to $${Number(cap - tvl).toFixed(2)}`,
			})
			return true
		}
		return false
	}

	const checkBalance = () => {
		console.log('🔍 checkBalance called', {
			rawInput: state.rawInput.toString(),
			balance: balance?.toString?.() || 'null/undefined',
			balanceNull: balance === null || balance === undefined,
		})

		if (balance === null || balance === undefined) {
			console.log('checkBalance: early return null balance')
			return false
		}

		const exceeds = state.rawInput > balance
		console.log(
			'checkBalance comparison:',
			state.rawInput.toString(),
			'>',
			balance.toString(),
			'=',
			exceeds,
		)

		if (exceeds) {
			dispatch({
				type: InputActionType.SET_ERROR,
				payload: `You do not have enough ${type === PoolsActionType.DEPOSIT ? 'USDC' : 'CLP'} on Arbitrum`,
			})
			console.log('checkBalance: SET_ERROR dispatched')
			return true
		}
		console.log('checkBalance: PASSED')
		return false
	}

	const checkMinDeposit = () => {
		console.log('🔍 checkMinDeposit called')
		if (type !== PoolsActionType.DEPOSIT) {
			console.log('checkMinDeposit: not deposit')
			return false
		}

		const inputDollars = Number(formatUnits(state.rawInput, 6))
		console.log('checkMinDeposit dollars:', inputDollars)
		if (inputDollars < 100 && inputDollars > 0) {
			dispatch({
				type: InputActionType.SET_ERROR,
				payload: `Minimum amount is $100 USDC`,
			})
			console.log('checkMinDeposit: SET_ERROR min')
			return true
		}
		console.log('checkMinDeposit: PASSED')
		return false
	}

	const clearValidations = () => {
		console.log('🧹 clearValidations called')
		dispatch({ type: InputActionType.CLEAR_ERROR })
		dispatch({ type: InputActionType.CLEAR_WARNING })
	}

	const validate = () => {
		console.log('🚀 VALIDATE START:', {
			input: state.input,
			rawInput: state.rawInput.toString(),
			emptyInput: state.input === '',
		})

		if (state.input === '') {
			console.log('validate: empty input → clear')
			clearValidations()
			return
		}

		console.log('validate: running checks...')
		if (checkCap()) {
			console.log('validate: STOPPED at checkCap')
			return
		}
		if (checkBalance()) {
			console.log('validate: STOPPED at checkBalance')
			return
		}
		if (checkMinDeposit()) {
			console.log('validate: STOPPED at checkMinDeposit')
			return
		}

		console.log('validate: ALL PASS → clear')
		clearValidations()
	}

	return { validate, checkCap, checkBalance, checkMinDeposit, clearValidations }
}
