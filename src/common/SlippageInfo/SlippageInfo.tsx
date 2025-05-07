import type { FC, ChangeEvent } from 'react'
import { Button, Tag } from '@concero/ui-kit'
import { useMemo, useState } from 'react'
import { SlippageIcon } from '../../assets/icons/SlippageIcon'
import { IconButton } from '@concero/ui-kit'
import { Input } from '@concero/ui-kit'
import { useSettingsStore } from '../../store/settings/useSettings'
import { defaultSlippage } from '../../store/settings/CreateSettingsStore'
import { SettingsIcon } from '../../assets/icons/SettingsIcon'
import './SlippageInfo.pcss'

export const SlippageInfo: FC = () => {
	const { slippage, setSlippage } = useSettingsStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [inputValue, setInputValue] = useState(slippage)

	const slippageIcon = useMemo(() => <SlippageIcon />, [])
	const settingsIcon = useMemo(() => <SettingsIcon />, [])

	const isAuto = useMemo(() => slippage === defaultSlippage, [slippage])

	const slippageTag = useMemo(
		() => (
			<Tag size="s" variant={isAuto ? 'neutral' : 'branded'}>
				{isAuto ? 'Auto' : 'Custom'}
			</Tag>
		),
		[isAuto],
	)

	const slippageValue = useMemo(() => `${slippage}%`, [slippage])

	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev)
		setInputValue(slippage)
	}

	const handleSave = () => {
		setSlippage(inputValue)
		setIsMenuOpen(false)
	}

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const settingsButton = useMemo(
		() => (
			<IconButton variant="tetrary" size="s" className="slippage_info_button" onClick={toggleMenu}>
				{settingsIcon}
			</IconButton>
		),
		[settingsIcon, toggleMenu],
	)

	return (
		<div className="slippage_info_wrapper">
			<div className="slippage_info_container">
				<div className="slippage_info_description">
					{slippageIcon}
					<p className="slippage_info_text">Slippage</p>
				</div>
				<div className="slippage_info_actions">
					{slippageTag}
					<p className="slippage_info_value">{slippageValue}</p>
					{settingsButton}
				</div>
			</div>

			{isMenuOpen && (
				<div className="slippage_info_menu">
					<Button variant="secondary_color" onClick={handleSave} size="m" isFull>
						Save
					</Button>
					<Input
						size="m"
						value={inputValue}
						onChange={handleInputChange}
						placeholder="Enter slippage %"
						className="slippage_input"
					/>
				</div>
			)}
		</div>
	)
}
