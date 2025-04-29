import { useCallback, useMemo } from 'react'
import { textToAmount } from '../utils/new/input'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'

export const useTextInputMode = (text: string, token: ExtendedToken | null) => {
	const { setAmount, clearAmount } = useFormStore()
	const balance = token?.balance ?? '0'

	const result = useMemo(() => {
		const amt = textToAmount(text, Number(balance))
		return {
			val: amt ? Math.round(Number(amt)).toString() : null,
			valid: Boolean(text && /^[a-z]+$/.test(text)),
		}
	}, [text, balance])

	return useCallback(() => {
		if (!result.valid) {
			clearAmount()
			return
		}

		result.val ? setAmount(result.val) : clearAmount()
	}, [result, setAmount, clearAmount])
}
