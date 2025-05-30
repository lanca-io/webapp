import { memo } from 'react'
import { Button, Input } from '@concero/ui-kit'
import { useSlippageInput } from '../../../hooks/useSlippageInput'
import './SlippageMenu.pcss'

type SlippageMenuProps = {
	isOpen: boolean
}

export const SlippageMenu = memo(({ isOpen }: SlippageMenuProps): JSX.Element | null => {
	const { isCustom, display, toggle, handleChange, handleBlur, handleFocus } = useSlippageInput()

	if (!isOpen) return null

	const handleMenuClick = (e: React.MouseEvent) => {
		e.stopPropagation()
	}

	return (
		<div className="slippage_menu" onClick={handleMenuClick}>
			<div className="slippage_menu_content">
				<Button
					variant={isCustom ? 'secondary' : 'secondary_color'}
					onClick={toggle}
					size="m"
					isFull
					className={!isCustom ? 'no-hover' : ''}
				>
					Auto
				</Button>
				<Input
					id="slippage-input"
					className="slippage_input"
					classNameWrap="slippage_input_wrap"
					size="m"
					value={display}
					onChange={handleChange}
					inputProps={{
						inputMode: 'decimal',
						onBlur: handleBlur,
						onFocus: handleFocus,
					}}
					placeholder="0.5%"
				/>
			</div>
			<div className="slippage_menu_separator" />
		</div>
	)
})
