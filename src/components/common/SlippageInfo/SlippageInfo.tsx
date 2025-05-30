import { memo, useCallback, useState, useEffect, useRef } from 'react'
import { Tag, IconButton } from '@concero/ui-kit'
import { SlippageIcon } from '../../../assets/icons/SlippageIcon'
import { SettingsIcon } from '../../../assets/icons/SettingsIcon'
import { SlippageMenu } from '../SlippageMenu/SlippageMenu'
import { useSettingsStore } from '../../../store/settings/useSettings'
import { format } from '../../../utils/new/format'
import { useFormStore } from '../../../store/form/useFormStore'
import { SlippageMode } from '../../../store/form/types'
import './SlippageInfo.pcss'

const VARIANT_MAPPING = {
	auto: 'neutral',
	custom: 'branded',
} as const

export const SlippageInfo = memo((): JSX.Element => {
	const { slippage } = useSettingsStore()
	const { slippageInputMode } = useFormStore()
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
	const [isHovered, setIsHovered] = useState<boolean>(false)
	const slippageRef = useRef<HTMLDivElement>(null)

	const isAuto = slippageInputMode === SlippageMode.Auto

	const toggleMenu = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsMenuOpen(prev => !prev)
	}, [])

	const handleEnter = useCallback(() => setIsHovered(true), [])
	const handleLeave = useCallback(() => setIsHovered(false), [])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (isMenuOpen && slippageRef.current && !slippageRef.current.contains(event.target as Node)) {
				setIsMenuOpen(false)
			}
		}

		if (isMenuOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isMenuOpen])

	const slippageValue = format(Number(slippage) * 100, 3)

	return (
		<div
			ref={slippageRef}
			className="slippage_info_wrapper"
			onMouseEnter={handleEnter}
			onMouseLeave={handleLeave}
			onClick={toggleMenu}
			role="button"
			tabIndex={0}
			aria-expanded={isMenuOpen}
			aria-haspopup="menu"
		>
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

					<p className="slippage_info_value">{slippageValue}%</p>

					<IconButton
						variant="tetrary"
						size="s"
						className="slippage_info_button"
						onClick={toggleMenu}
						isFocused={isMenuOpen}
						isHovered={isHovered}
						aria-label="Toggle slippage settings"
					>
						<SettingsIcon aria-hidden="true" />
					</IconButton>
				</div>
			</div>

			<SlippageMenu isOpen={isMenuOpen} />
		</div>
	)
})
