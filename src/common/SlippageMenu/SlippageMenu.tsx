import type { FC } from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { Button, Input } from '@concero/ui-kit'
import { useSettingsStore } from '../../store/settings/useSettings'
import { defaultSlippage } from '../../store/settings/CreateSettingsStore'
import './SlippageMenu.pcss'

type SlippageMenuProps = {
	isOpen: boolean
}

export const SlippageMenu: FC<SlippageMenuProps> = ({ isOpen }) => {
	const { slippage, setSlippage } = useSettingsStore()
	const [custom, setCustom] = useState(slippage !== defaultSlippage)
	const [val, setVal] = useState(slippage)

	useEffect(() => {
		if (slippage === defaultSlippage) {
			setCustom(false)
			setVal(defaultSlippage)
		}
	}, [slippage])

	const handleButton = useCallback(() => {
		if (!custom) {
			setCustom(true)
			setVal('')
		} else {
			setCustom(false)
			setSlippage(defaultSlippage)
		}
	}, [custom, setSlippage])

	const handleInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = e.target.value.replace(/%/g, '')
			if (/^(\d+)?\.?(\d{0,3})?$/.test(raw)) {
				if (raw && parseFloat(raw) > 100) {
					setVal('100')
					setSlippage('100')
				} else {
					setVal(raw)
					if (raw) setSlippage(raw)
				}
			}
		},
		[setSlippage],
	)

	const handleBlur = useCallback(() => {
		if (!val || parseFloat(val) < 0.1) {
			setSlippage(defaultSlippage)
			setCustom(false)
		}
	}, [val, setSlippage])

	const inputProps = useMemo(
		() => ({
			inputMode: 'decimal' as const,
			onBlur: handleBlur,
		}),
		[handleBlur],
	)

	const display = useMemo(() => (custom ? (val ? `${val}%` : '') : `${defaultSlippage}%`), [custom, val])

	const autoButton = useMemo(
		() => (
			<Button variant={custom ? 'secondary' : 'secondary_color'} onClick={handleButton} size="m" isFull>
				Auto
			</Button>
		),
		[custom, handleButton],
	)

	const slippageInput = useMemo(
		() => (
			<Input
				className="slippage_input"
				size="m"
				value={display}
				onChange={handleInput}
				isDisabled={!custom}
				inputProps={inputProps}
				placeholder="0.5%"
			/>
		),
		[display, handleInput, custom, inputProps],
	)

	if (!isOpen) return null

	return (
		<div className="slippage_menu">
			{autoButton}
			{slippageInput}
		</div>
	)
}
