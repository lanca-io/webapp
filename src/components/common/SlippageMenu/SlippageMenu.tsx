import { memo } from 'react'
import { Button, Input } from '@concero/ui-kit'
import { useHandleSlippageInput } from '../../../hooks/useHandleSlippageInput'
import './SlippageMenu.pcss'

type SlippageMenuProps = {
	isOpen: boolean
}

export const SlippageMenu = memo(({ isOpen }: SlippageMenuProps): JSX.Element | null => {
	const { isCustom, display, toggle, handleChange, handleBlur } = useHandleSlippageInput()

	console.log(display, 'display')
	console.log(isCustom, 'isCustom')
	console.log(isOpen, 'isOpen')

	if (!isOpen) return null

	return (
		<div className="slippage_menu">
			<Button
				variant={isCustom ? 'secondary' : 'secondary_color'}
				onClick={toggle}
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
				value={display}
				onChange={handleChange}
				isDisabled={!isCustom}
				inputProps={{
					inputMode: 'decimal',
					'aria-label': 'Custom slippage value',
					onBlur: handleBlur,
				}}
				placeholder="0.5%"
			/>
		</div>
	)
})
