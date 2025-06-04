import type { FC } from 'react'
import { Fragment, useMemo, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@concero/ui-kit'
import { DividerIcon } from '../../assets/icons/DividerIcon'
import { TrophyIcon } from '../../assets/icons/TrophyIcon'
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'
import { trackEvent } from '../../hooks/useTracking'
import { action, category } from '../../constants/tracking'
import { truncateWallet } from '../../utils/formatting'
import { Burger } from './Burger/Burger'
import './Header.pcss'

type NavItem = {
	to: string
	label: string
	icon?: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
	{
		to: '/swap',
		label: 'Swap',
	},
	{
		to: '/liquidity',
		label: 'Provide Liquidity',
	},
	{
		to: '/rewards',
		label: 'Rewards Portal',
		icon: <TrophyIcon width={16} height={16} color="var(--color-grey-600)" />,
	},
]

export const Header: FC = () => {
	const { open } = useAppKit()
	const { address, isConnected, isConnecting } = useAccount()
	const location = useLocation()

	const handleWalletClick = useCallback(() => {
		void open()
		trackEvent({
			category: category.Wallet,
			action: action.ClickConnectWallet,
			label: 'Clicked Connect Wallet',
		})
	}, [open])

	const walletButtonText = useMemo(() => {
		if (isConnected) return truncateWallet(address!)
		if (isConnecting) return 'Connecting...'
		return 'Connect Wallet'
	}, [isConnected, isConnecting, address])

	const navItems = useMemo(() => {
		return NAV_ITEMS.map((item, idx) => (
			<Fragment key={item.to}>
				{idx === 2 && <DividerIcon />}
				<Link
					to={item.to}
					className={`header_nav_item${location.pathname === item.to ? ' active' : ''}`}
					aria-current={location.pathname === item.to ? 'page' : undefined}
				>
					<div className="header_nav_item_wrap">
						{item.icon && <span className="header_nav_item_icon">{item.icon}</span>}
						<span className="header_nav_item_text">{item.label}</span>
					</div>
				</Link>
			</Fragment>
		))
	}, [location.pathname])

	return (
		<header className="header">
			<div className="header_info">
				<Link to="/" className="header_info_logo">
					<img src="/Header/Lanca.svg" alt="Lanca Logo" width={111} height={32} />
				</Link>
				<nav className="header_nav">{navItems}</nav>
			</div>
			<div className="header_actions">
				<Button variant={isConnected ? 'secondary' : 'secondary_color'} size="m" onClick={handleWalletClick}>
					{walletButtonText}
				</Button>
				<Burger />
			</div>
		</header>
	)
}
