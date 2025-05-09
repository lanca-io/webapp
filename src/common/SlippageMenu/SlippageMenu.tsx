import type { FC } from 'react'
import { useMemo } from 'react'
import { Button, Input } from '@concero/ui-kit'
import { useSettingsStore } from '../../store/settings/useSettings'
import { useHandleSlippageInput } from '../../hooks/useHandleSlippageInput'
import './SlippageMenu.pcss'

const MAX_SLIPPAGE = 100

type SlippageMenuProps = {
	isOpen: boolean
}

export const SlippageMenu: FC<SlippageMenuProps> = ({ isOpen }) => {
	const { slippage, setSlippage } = useSettingsStore()
	const { isCustom, displayValue, toggleMode, onChange, onBlur } = useHandleSlippageInput(
		slippage,
		setSlippage,
		MAX_SLIPPAGE,
	)

	const actionButton = useMemo(
		() => (
			<Button variant={isCustom ? 'secondary' : 'secondary_color'} onClick={toggleMode} size="m" isFull>
				Auto
			</Button>
		),
		[isCustom, toggleMode],
	)

	const input = useMemo(
		() => (
			<Input
				className="slippage_input"
				size="m"
				value={displayValue}
				onChange={onChange}
				isDisabled={!isCustom}
				inputProps={{
					inputMode: 'decimal',
					onBlur,
				}}
				placeholder="0.5%"
			/>
		),
		[displayValue, onChange, isCustom, onBlur],
	)

	if (!isOpen) return null

	return (
		<div className="slippage_menu">
			{actionButton}
			{input}
		</div>
	)
}
