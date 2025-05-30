import { type FC, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import classNames from './Header.module.pcss'
import { Logo } from '../../Logo/Logo'
import { useQuery } from '../../../../hooks/useQuery'
import { WalletButton } from '../WalletButton/WalletButton'
import { BurgerMenu } from '../BurgerMenu/BurgerMenu'
import { Button } from '../../buttons/Button/Button'
import { routes } from '../../../../constants/routes'

interface HeaderProps {
	children?: ReactNode
}

export const Header: FC<HeaderProps> = ({ children }) => {
	const isMobile = useQuery('mobile')
	const location = useLocation()

	const getButtonClass = (path: string) => {
		return location.pathname === path
			? `${classNames.headerButton} ${classNames.activeButton}`
			: classNames.headerButton
	}

	return (
		<header className={classNames.header}>
			{children}
			<div className={classNames.navigatorContainer}>
				<div className={classNames.logoContainer}>
					<Logo />
				</div>
				{!isMobile && (
					<ul className="gap-xs">
						<a className={classNames.link} href={routes.home} rel="noreferrer">
							<Button className={getButtonClass(routes.home)}>Swap</Button>
						</a>
						<a className={classNames.link} href={routes.pools} rel="noreferrer">
							<Button className={getButtonClass(routes.pools)}>Provide Liquidity</Button>
						</a>
					</ul>
				)}
			</div>
			<div className={classNames.headerButtonsContainer}>
				<WalletButton />
				<BurgerMenu />
			</div>
		</header>
	)
}
