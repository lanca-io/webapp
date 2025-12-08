import type { DropdownProps } from './types'
import type { FC } from 'react'
import { blo } from 'blo'
import { useAccount } from 'wagmi'
import { Item, ItemType } from '../Item'
import { Toggle } from '../Toggle'
import { Switch } from '@concero/ui-kit'
import { externalRoutes } from '@/constants'
import { Theme } from '@/store/settings/types'
import { UserIcon } from '@/assets/icons/UserIcon'
import { TrailRight } from '@/assets/icons/TrailRight'
import { RewardsIcon } from '@/assets/icons/Rewards'
import { DarkThemeIcon } from '@/assets/icons/DarkThemeIcon'
import { useIsMobile, useIsTablet } from '@/hooks'
import { useAppKit } from '@reown/appkit/react'
import { useSettingsStore } from '@/store/settings/useSettings'
import { SupportModal } from '@/components/common/SupportModal'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import './Dropdown.pcss'

export const Dropdown: FC<DropdownProps> = ({ isOpen, onToggle }) => {
	const { address, isConnected } = useAccount()
	const { theme, setTheme } = useSettingsStore()
	const { open } = useAppKit()
	const [showSupport, setShowSupport] = useState<boolean>(false)

	const isTablet: boolean = useIsTablet()
	const isMobile: boolean = useIsMobile()
	const showRewards: boolean = isTablet || isMobile

	const toggleTheme = useCallback(() => {
		setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)
	}, [theme, setTheme])

	const profileItem = useMemo(
		() =>
			address &&
			isConnected && (
				<>
					<Item
						title={`${address.slice(0, 4)}...${address.slice(-4)}`}
						icon={
							<img
								src={blo(address, 32)}
								alt="avatar"
								className="dropdown_item_profile_icon"
								loading="lazy"
							/>
						}
						tail={<TrailRight />}
						type={ItemType.PROFILE}
						onAction={() => open()}
					/>
					<div className="header_dropdown_divider" />
				</>
			),
		[address, isConnected, open],
	)

	const rewardsItem = showRewards && (
		<>
			<Item
				title="Rewards Portal"
				type={ItemType.DEFAULT}
				icon={<RewardsIcon />}
				tail={<TrailRight />}
				onAction={() => window.open(externalRoutes.rewards, '_blank', 'noopener,noreferrer')}
			/>
			<div className="header_dropdown_divider" />
		</>
	)

	const dropdownRef = useRef<HTMLDivElement>(null)
	const toggleRef = useRef<HTMLDivElement>(null)

	const handleOutsideClick = useCallback(
		(event: MouseEvent) => {
			const target = event.target as Node
			if (
				(target as HTMLElement)?.closest('header') ||
				(target as HTMLElement)?.closest('.support_modal_overlay') ||
				(target as HTMLElement)?.closest('.support_modal') ||
				(target as HTMLElement)?.closest('w3m-modal') ||
				(target as HTMLElement)?.closest('wui-flex')
			) {
				return
			}
			if (toggleRef.current?.contains(target) || dropdownRef.current?.contains(target)) return
			onToggle()
		},
		[onToggle],
	)

	useEffect(() => {
		if (!isOpen) return
		document.addEventListener('mousedown', handleOutsideClick)
		return () => document.removeEventListener('mousedown', handleOutsideClick)
	}, [isOpen, handleOutsideClick])

	return (
		<>
			<div className="header_dropdown">
				<div ref={toggleRef}>
					<Toggle isOpen={isOpen} onToggle={onToggle} />
				</div>
				{isOpen && (
					<div ref={dropdownRef} className="header_dropdown_container">
						{profileItem}
						{rewardsItem}
						<Item
							title="Dark Theme"
							type={ItemType.DEFAULT}
							icon={<DarkThemeIcon />}
							tail={<Switch checked={theme === Theme.DARK} onChange={toggleTheme} />}
							onAction={toggleTheme}
						/>
						<div className="header_dropdown_divider" />
						<Item
							title="Contact Support"
							type={ItemType.DEFAULT}
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
