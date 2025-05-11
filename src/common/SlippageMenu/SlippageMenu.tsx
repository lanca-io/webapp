import { memo } from 'react'
import { Button, Input } from '@concero/ui-kit'
import { useSettingsStore } from '../../store/settings/useSettings'
import { useHandleSlippageInput } from '../../hooks/useHandleSlippageInput'
import './SlippageMenu.pcss'

const MAX_SLIPPAGE = 100

type SlippageMenuProps = {
	isOpen: boolean
}

export const SlippageMenu = memo(({ isOpen }: SlippageMenuProps): JSX.Element | null => {
	const { slippage, setSlippage } = useSettingsStore()
	const { isCustom, displayValue, toggleMode, onChange, onBlur } = useHandleSlippageInput(
		slippage,
		setSlippage,
		MAX_SLIPPAGE,
	)

	if (!isOpen) return null

	return (
		<div className="slippage_menu" role="dialog" aria-modal="true" aria-label="Slippage settings">
			<Button
				variant={isCustom ? 'secondary' : 'secondary_color'}
				onClick={toggleMode}
				size="m"
				isFull
				aria-pressed={isCustom}
				aria-label={isCustom ? 'Switch to auto slippage' : 'Switch to custom slippage'}
			>
				Auto
			</Button>
			<Input
				className="slippage_input"
				size="m"
				value={displayValue}
				onChange={onChange}
				isDisabled={!isCustom}
				inputProps={{
					inputMode: 'decimal',
					onBlur,
					'aria-label': 'Custom slippage value',
				}}
				placeholder="0.5%"
			/>
		</div>
	)
})
