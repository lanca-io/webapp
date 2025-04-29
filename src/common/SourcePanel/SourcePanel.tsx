import type { FC } from 'react'
import { useState, useMemo } from 'react'
import { useInputMode } from '../../hooks/useInputMode'
import { AmountInput } from '../AmountInput/AmountInput'
import { useFormStore } from '../../store/form/useFormStore'
import { useInputHandlers } from '../../hooks/useInputHandlers'

export const SourcePanel: FC = () => {
	const [value, setValue] = useState<string>('')

	const { sourceToken } = useFormStore()
	const { mode, setMode, determineMode } = useInputMode(value, sourceToken)
	const { handleChange, handleFocus, handleBlur } = useInputHandlers(setValue, mode, setMode, determineMode)

	const amountInput = useMemo(
		() => <AmountInput value={value} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />,
		[value, handleChange, handleFocus, handleBlur],
	)

	return <>{amountInput}</>
}
