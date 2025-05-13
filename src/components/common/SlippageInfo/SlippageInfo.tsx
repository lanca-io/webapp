import { memo, useCallback, useState } from 'react'
import { Tag, IconButton } from '@concero/ui-kit'
import { SlippageIcon } from '../../../assets/icons/SlippageIcon'
import { SettingsIcon } from '../../../assets/icons/SettingsIcon'
import { SlippageMenu } from '../SlippageMenu/SlippageMenu'
import { useSettingsStore } from '../../../store/settings/useSettings'
import { defaultSlippage } from '../../../store/settings/CreateSettingsStore'
import './SlippageInfo.pcss'

const VARIANT_MAPPING = {
	auto: 'neutral',
	custom: 'branded',
} as const

export const SlippageInfo = memo((): JSX.Element => {
	const { slippage } = useSettingsStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const isAuto = slippage === defaultSlippage
	const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), [])

	return (
		<div className="slippage_info_wrapper" role="group" aria-label="Slippage settings">
			<div className="slippage_info_container">
				<div className="slippage_info_description">
					<SlippageIcon aria-hidden="true" />
					<p className="slippage_info_text">Slippage</p>
				</div>

				<div className="slippage_info_actions">
					<Tag
						size="s"
						variant={isAuto ? VARIANT_MAPPING.auto : VARIANT_MAPPING.custom}
						aria-label={`Slippage type: ${isAuto ? 'auto' : 'custom'}`}
					>
						{isAuto ? 'Auto' : 'Custom'}
					</Tag>

					<p className="slippage_info_value" aria-label={`Current slippage: ${slippage}%`}>
						{slippage}%
					</p>

					<IconButton
						variant="tetrary"
						size="s"
						className="slippage_info_button"
						onClick={toggleMenu}
						aria-label="Adjust slippage settings"
						aria-haspopup="dialog"
						aria-expanded={isMenuOpen}
					>
						<SettingsIcon aria-hidden="true" />
					</IconButton>
				</div>
			</div>

			<SlippageMenu isOpen={isMenuOpen} />
		</div>
	)
})
