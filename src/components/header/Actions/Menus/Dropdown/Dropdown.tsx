import type { DropdownProps } from './types'
import type { FC } from 'react'
import { Item } from '../Item'
import { Toggle } from '../Toggle'
import { Switch } from '@concero/ui-kit'
import { externalRoutes } from '@/constants'
import { Theme } from '@/store/settings/types'
import { UserIcon } from '@/assets/icons/UserIcon'
import { TrailRight } from '@/assets/icons/TrailRight'
import { RewardsIcon } from '@/assets/icons/Rewards'
import { useIsMobile, useIsTablet } from '@/hooks'
import { useAccount } from 'wagmi'
import { blo } from 'blo'
import { useAppKit } from '@reown/appkit/react'
import { DarkThemeIcon } from '@/assets/icons/DarkThemeIcon'
import { useSettingsStore } from '@/store/settings/useSettings'
import { SupportModal } from '@/components/common/SupportModal'
import { useCallback, useEffect, useRef, useState } from 'react'
import './Dropdown.pcss'

export const Dropdown: FC<DropdownProps> = ({ isOpen, onToggle }): JSX.Element => {
	const { address, isConnected } = useAccount()
	const { theme, setTheme } = useSettingsStore()
	const { open } = useAppKit()
	const [showSupport, setShowSupport] = useState<boolean>(false)

	const isTablet = useIsTablet()
	const isMobile = useIsMobile()

	const dropdownRef = useRef<HTMLDivElement>(null)
	const toggleRef = useRef<HTMLDivElement>(null)

	const toggleTheme = useCallback((): void => {
		const newTheme = theme === Theme.DARK ? Theme.LIGHT : Theme.DARK
		setTheme(newTheme)
	}, [theme, setTheme])

	const closeDropdown: EventListener = useCallback(
		(event: Event) => {
			const target = event.target as Node
			if (toggleRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
				return
			}
			onToggle()
		},
		[onToggle],
	)

	useEffect(() => {
		if (!isOpen) return
		document.addEventListener('mousedown', closeDropdown)
		return () => {
			document.removeEventListener('mousedown', closeDropdown)
		}
	}, [isOpen, closeDropdown])

	return (
		<>
			<div className="header_dropdown">
				<div ref={toggleRef}>
					<Toggle isOpen={isOpen} onToggle={onToggle} />
				</div>
				{isOpen && (
					<div ref={dropdownRef} className="header_dropdown_container">
						{address && isConnected && (
							<>
								<Item
									title={`${address.slice(0, 4)}...${address.slice(-4)}`}
									indenticon={blo(address, 32)}
									tail={<TrailRight />}
									isExpanded={true}
									onAction={() => open()}
								/>
								<div className="header_dropdown_divider" />
							</>
						)}
						{(isTablet || isMobile) && (
							<>
								<Item
									title="Rewards Portal"
									icon={<RewardsIcon />}
									tail={<TrailRight />}
									onAction={() =>
										window.open(externalRoutes.rewards, '_blank', 'noopener,noreferrer')
									}
								/>
								<div className="header_dropdown_divider" />
							</>
						)}
						<Item
							title="Dark Theme"
							icon={<DarkThemeIcon />}
							tail={<Switch checked={theme === Theme.DARK} onChange={toggleTheme} />}
							onAction={toggleTheme}
						/>
						<div className="header_dropdown_divider" />
						<Item
							title="Contact Support"
							icon={<UserIcon />}
							tail={<TrailRight />}
							onAction={() => setShowSupport(true)}
						/>
					</div>
				)}
			</div>
			{showSupport && <SupportModal isOpen={showSupport} onClose={() => setShowSupport(false)} />}
		</>
	)
}
