import type { FC } from 'react'
import { Tag } from '@concero/ui-kit'
import { useMemo, useState } from 'react'
import { SlippageIcon } from '../../assets/icons/SlippageIcon'
import { IconButton } from '@concero/ui-kit'
import { SlippageMenu } from '../SlippageMenu/SlippageMenu'
import { useSettingsStore } from '../../store/settings/useSettings'
import { defaultSlippage } from '../../store/settings/CreateSettingsStore'
import { SettingsIcon } from '../../assets/icons/SettingsIcon'
import './SlippageInfo.pcss'

export const SlippageInfo: FC = () => {
	const { slippage } = useSettingsStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const slippageIcon = useMemo(() => <SlippageIcon />, [])
	const settingsIcon = useMemo(() => <SettingsIcon />, [])

	const isAuto = useMemo(() => slippage === defaultSlippage, [slippage])

	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev)
	}

	const slippageTag = useMemo(
		() => (
			<Tag size="s" variant={isAuto ? 'neutral' : 'branded'}>
				{isAuto ? 'Auto' : 'Custom'}
			</Tag>
		),
		[isAuto],
	)

	const slippageValue = useMemo(() => `${slippage}%`, [slippage])

	const settingsButton = useMemo(
		() => (
			<IconButton variant="tetrary" size="s" className="slippage_info_button" onClick={toggleMenu}>
				{settingsIcon}
			</IconButton>
		),
		[settingsIcon, toggleMenu],
	)

	const slippageMenu = useMemo(() => <SlippageMenu isOpen={isMenuOpen} />, [isMenuOpen])

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
			{slippageMenu}
		</div>
	)
}
