import type { FC } from 'react'
import { useState, useCallback, useMemo } from 'react'
import { Tag, IconButton } from '@concero/ui-kit'
import { SlippageIcon } from '../../assets/icons/SlippageIcon'
import { SettingsIcon } from '../../assets/icons/SettingsIcon'
import { SlippageMenu } from '../SlippageMenu/SlippageMenu'
import { useSettingsStore } from '../../store/settings/useSettings'
import { defaultSlippage } from '../../store/settings/CreateSettingsStore'
import './SlippageInfo.pcss'

const VARIANT_MAPPING = {
	auto: 'neutral',
	custom: 'branded',
} as const

export const SlippageInfo: FC = () => {
	const { slippage } = useSettingsStore()
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

	const isAuto = slippage === defaultSlippage
	const tagVariant = isAuto ? VARIANT_MAPPING.auto : VARIANT_MAPPING.custom
	const tagLabel = isAuto ? 'Auto' : 'Custom'

	const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])

	const tag = useMemo(
		() => (
			<Tag size="s" variant={tagVariant}>
				{tagLabel}
			</Tag>
		),
		[tagVariant, tagLabel],
	)

	const slippageValue = useMemo(() => <p className="slippage_info_value">{slippage}%</p>, [slippage])

	const iconButton = useMemo(
		() => (
			<IconButton
				variant="tetrary"
				size="s"
				className="slippage_info_button"
				onClick={toggleMenu}
				aria-label="Slippage settings"
			>
				<SettingsIcon />
			</IconButton>
		),
		[toggleMenu],
	)

	const slippageIcon = useMemo(() => <SlippageIcon aria-hidden="true" />, [])

	const slippageMenu = useMemo(() => <SlippageMenu isOpen={isMenuOpen} />, [isMenuOpen])

	return (
		<div className="slippage_info_wrapper">
			<div className="slippage_info_container">
				<div className="slippage_info_description">
					{slippageIcon}
					<p className="slippage_info_text">Slippage</p>
				</div>
				<div className="slippage_info_actions">
					{tag}
					{slippageValue}
					{iconButton}
				</div>
			</div>
			{slippageMenu}
		</div>
	)
}
