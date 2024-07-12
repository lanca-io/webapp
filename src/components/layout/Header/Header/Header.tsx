import { useState } from 'react'
import classNames from './Header.module.pcss'
import { Logo } from '../../Logo/Logo'
import { WalletButton } from '../WalletButton/WalletButton'
import { BurgerMenu } from '../BurgerMenu/BurgerMenu'
import { FeedbackModal } from '../../../modals/FeedbackModal/FeedbackModal'

export const Header = () => {
	const [isFeedbackModalOpened, setIsFeedbackModalOpened] = useState(false)

	return (
		<header className={classNames.header}>
			<div className={classNames.navigatorContainer}>
				<div className={classNames.logoContainer}>
					<Logo />
				</div>
			</div>
			<div className={classNames.headerButtonsContainer}>
				<WalletButton />
				<BurgerMenu />
			</div>
			<FeedbackModal show={isFeedbackModalOpened} setShow={setIsFeedbackModalOpened} />
		</header>
	)
}
