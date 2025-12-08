import type { BurgerProps } from './types'
import type { FC } from 'react'
import { blo } from 'blo'
import { useAppKit } from '@reown/appkit/react'
import { Item, ItemType } from '../Item'
import { Toggle } from '../Toggle'
import { Switch } from '@concero/ui-kit'
import { externalRoutes, routes } from '@/constants'
import { Theme } from '@/store/settings/types'
import { UserIcon } from '@/assets/icons/UserIcon'
import { TrailRight } from '@/assets/icons/TrailRight'
import { RewardsIcon } from '@/assets/icons/Rewards'
import { DarkThemeIcon } from '@/assets/icons/DarkThemeIcon'
import { useIsMobile, useIsTablet } from '@/hooks'
import { useAccount } from 'wagmi'
import { useNavigate } from 'react-router-dom'
import { BridgeIcon } from '@/assets/icons/BridgeIcon'
import { PoolsIcon } from '@/assets/icons/PoolsIcon'
import { useSettingsStore } from '@/store/settings/useSettings'
import { SupportModal } from '@/components/common/SupportModal'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './Burger.pcss'

export const Burger: FC<BurgerProps> = ({ isOpen, onToggle }) => {
	const navigate = useNavigate()
	const { address, isConnected } = useAccount()
	const { open } = useAppKit()
	const { theme, setTheme } = useSettingsStore()
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
					<div className="header_burger_divider" />
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
			<div className="header_burger_divider" />
		</>
	)

	const burgerRef = useRef<HTMLDivElement>(null)
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
			if (toggleRef.current?.contains(target) || burgerRef.current?.contains(target)) return
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
			<div className="header_burger">
				<div ref={toggleRef}>
					<Toggle isOpen={isOpen} onToggle={onToggle} />
				</div>
				{isOpen && (
					<div ref={burgerRef} className="header_burger_container">
						{profileItem}
						<Item
							title="Swap & Bridge"
							type={ItemType.EXPANDED}
							icon={<BridgeIcon />}
							onAction={() => navigate(routes.home)}
						/>
						<Item
							title="Provide Liquidity"
							type={ItemType.EXPANDED}
							icon={<PoolsIcon />}
							onAction={() => navigate(routes.pools)}
						/>
						<div className="header_burger_divider" />
						{rewardsItem}
						<Item
							title="Dark Theme"
							type={ItemType.DEFAULT}
							icon={<DarkThemeIcon />}
							tail={<Switch checked={theme === Theme.DARK} onChange={toggleTheme} />}
							onAction={toggleTheme}
						/>
						<div className="header_burger_divider" />
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
