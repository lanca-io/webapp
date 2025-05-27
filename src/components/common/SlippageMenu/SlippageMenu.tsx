import { memo } from 'react'
import { Button, Input } from '@concero/ui-kit'
import { useHandleSlippageInput } from '../../../hooks/useHandleSlippageInput'
import './SlippageMenu.pcss'

type SlippageMenuProps = {
	isOpen: boolean
}

export const SlippageMenu = memo(({ isOpen }: SlippageMenuProps): JSX.Element | null => {
	const { isCustom, display, toggle, handleChange, handleBlur } = useHandleSlippageInput()

	if (!isOpen) return null

	return (
		<div className="slippage_menu">
			<div className="slippage_menu_content">
				<Button variant={isCustom ? 'secondary' : 'secondary_color'} onClick={toggle} size="m" isFull>
					Auto
				</Button>
				<Input
					className="slippage_input"
					classNameWrap="slippage_input_wrap"
					size="m"
					value={display}
					onChange={handleChange}
					inputProps={{
						inputMode: 'decimal',
						onBlur: handleBlur,
					}}
					placeholder="0.5%"
				/>
			</div>
			<div className="slippage_menu_separator" />
		</div>
	)
})
