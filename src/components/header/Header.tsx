import type { FC } from 'react'
import { Fragment, useMemo, useCallback, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@concero/ui-kit'
import { DividerIcon } from '../../assets/icons/DividerIcon'
import { TrophyIcon } from '../../assets/icons/TrophyIcon'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { trackEvent } from '../../hooks/useTracking'
import { action, category } from '../../constants/tracking'
import { Dropdown } from './Dropdown/Dropdown'
import { routes } from '../../constants/routes'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { useIsTablet } from '../../hooks/useMediaQuery'
import { ContactSupportModal } from '../modals/ContactSupportModal/ContactSupportModal'
import { truncateAddress } from '../../utils/new/truncate'
import { Burger } from './Burger/Burger'
import { TrailArrowRightIcon } from '../../assets/icons/TrailArrowRightIcon'
import { WalletIcon } from '../../assets/icons/WalletIcon'
import './Header.pcss'

type NavItem = {
	to: string
	label: string
	icon?: React.ReactNode
	dividerBefore?: boolean
}

const NAV_ITEMS: NavItem[] = [
	{ to: routes.home, label: 'Swap & Bridge' },
	{ to: routes.pools, label: 'Provide Liquidity' },
	{
		to: 'https://app.concero.io/rewards',
		label: 'Rewards Portal',
		icon: <TrophyIcon width={16} height={16} color="var(--color-grey-600)" />,
		dividerBefore: true,
	},
]

export const Header: FC = () => {
	const { open } = useAppKit()
	const { address, isConnected, isConnecting } = useAccount()
	const location = useLocation()
	const isMobile = useIsMobile()
	const isTablet = useIsTablet()
	const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
	const [isBurgerOpen, setIsBurgerOpen] = useState<boolean>(false)

	const isDesktop = !isMobile && !isTablet
	const showNavItems = isDesktop
	const showDropdown = isTablet
	const showBurger = isMobile

	useEffect(() => {
		setIsDropdownOpen(false)
		setIsBurgerOpen(false)
	}, [location.pathname])

	const handleWalletClick = useCallback(() => {
		open().catch(console.error)
		trackEvent({
			category: category.Wallet,
			action: action.ClickConnectWallet,
			label: 'Clicked Connect Wallet',
		})
	}, [open])

	const handleSupportClick = useCallback(() => {
		setIsSupportModalOpen(true)
	}, [])

	const walletButtonText = useMemo(() => {
		if (isConnected) return truncateAddress(address!, 4, 4)
		if (isConnecting) return 'Connecting...'
		return 'Connect Wallet'
	}, [isConnected, isConnecting, address])

	const navItems = useMemo(
		() =>
			NAV_ITEMS.map(item => (
				<Fragment key={item.to}>
					{item.dividerBefore && <DividerIcon />}
					<Link to={item.to} className={`header_nav_item${location.pathname === item.to ? ' active' : ''}`}>
						<div className="header_nav_item_wrap">
							{item.icon && <span className="header_nav_item_icon">{item.icon}</span>}
							<span className="header_nav_item_text">{item.label}</span>
						</div>
					</Link>
				</Fragment>
			)),
		[location.pathname],
	)

	return (
		<header className="header">
			<div className="header_info">
				<Link to="/" className="header_info_logo">
					<img src="/Header/Lanca.svg" alt="Lanca Logo" width={111} height={32} loading="lazy" />
				</Link>
				{showNavItems && <nav className="header_nav">{navItems}</nav>}
			</div>
			<div className="header_actions">
				{isDesktop && (
					<Button variant="secondary" size="m" onClick={handleSupportClick}>
						Contact Support
					</Button>
				)}
				<Button
					variant={isConnected ? 'secondary' : 'secondary_color'}
					rightIcon={isConnected ? <TrailArrowRightIcon /> : undefined}
					leftIcon={isConnected ? <WalletIcon /> : undefined}
					size="m"
					onClick={handleWalletClick}
				>
					{walletButtonText}
				</Button>

				{showDropdown && (
					<Dropdown isMenuOpen={isDropdownOpen} onToggleMenu={() => setIsDropdownOpen(prev => !prev)} />
				)}
				{showBurger && <Burger isMenuOpen={isBurgerOpen} onToggleMenu={() => setIsBurgerOpen(prev => !prev)} />}
			</div>
			{isSupportModalOpen && (
				<ContactSupportModal isShow={isSupportModalOpen} setIsShow={setIsSupportModalOpen} />
			)}
		</header>
	)
}
