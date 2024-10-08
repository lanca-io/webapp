import { type FC, type ReactNode } from 'react'
import classNames from './Header.module.pcss'
import { Logo } from '../../Logo/Logo'
import { useMediaQuery } from '../../../../hooks/useMediaQuery'
import { WalletButton } from '../WalletButton/WalletButton'
import { BurgerMenu } from '../BurgerMenu/BurgerMenu'
import { Button } from '../../buttons/Button/Button'

interface HeaderProps {
	children?: ReactNode
}

export const Header: FC<HeaderProps> = ({ children }) => {
	const isMobile = useMediaQuery('mobile')

	return (
		<header className={classNames.header}>
			{children}
			<div className={classNames.navigatorContainer}>
				<div className={classNames.logoContainer}>
					<Logo />
				</div>
				{!isMobile && (
					<ul className="gap-xs">
						<a
							className={classNames.link}
							target="_blank"
							href="https://app.concero.io/pool"
							rel="noreferrer"
						>
							<Button variant="tetrary">Provide Liquidity</Button>
						</a>
						<a
							className={classNames.link}
							target="_blank"
							href="https://app.concero.io/rewards"
							rel="noreferrer"
						>
							<Button variant="tetrary">Rewards</Button>
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
