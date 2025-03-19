import type { FC } from 'react'
import { useState } from 'react'
import { useMode } from '../useMode'
import { useInputHandlers } from '../useInputHandlers'
import { useFormStore } from '../../../../store/form/useFormStore'
import classNames from './AmountInput.module.pcss'
import { InfoDisplay } from '../InfoDisplay/InfoDisplay'

export const AmountInput: FC = () => {
	const { srcToken } = useFormStore()
	const [value, setValue] = useState<string>('')

	const { mode, setMode, determineMode } = useMode(value, srcToken)
	const { handleChange, handleFocus, handleBlur } = useInputHandlers(setValue, mode, setMode, determineMode)

	return (
		<>
			<div className={classNames['amount-input']}>
				<input
					type="text"
					className={classNames['input']}
					placeholder="0"
					value={value}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
				/>
			</div>
			<InfoDisplay token={srcToken} mode={mode} value={value} />
		</>
	)
}
