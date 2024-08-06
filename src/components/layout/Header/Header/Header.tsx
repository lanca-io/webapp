import { useState } from 'react'
import classNames from './Header.module.pcss'
import { Logo } from '../../Logo/Logo'
import { WalletButton } from '../WalletButton/WalletButton'
import { BurgerMenu } from '../BurgerMenu/BurgerMenu'
import { FeedbackModal } from '../../../modals/FeedbackModal/FeedbackModal'
import { useMediaQuery } from '../../../../hooks/useMediaQuery'
import { WithTooltip } from '../../../wrappers/WithTooltip'
import { ComingSoonLinks } from './ComingSoonLinks'
import { TooltipContent } from './TooltipContent'

export const Header = () => {
	const [isFeedbackModalOpened, setIsFeedbackModalOpened] = useState(false)
	const isMobile = useMediaQuery('mobile')

	const ComingSoon = WithTooltip({
		WrappedComponent: ComingSoonLinks,
		Tooltip: TooltipContent,
	})

	return (
		<header className={classNames.header}>
			<div className={classNames.navigatorContainer}>
				<div className={classNames.logoContainer}>
					<Logo />
				</div>
				{!isMobile ? (
					<ul>
						{/* {ComingSoon} */}
						<a target="_blank" href="https://app.concero.io/pool" rel="noreferrer">
							Earn
						</a>
						<a target="_blank" href="https://app.concero.io/rewards" rel="noreferrer">
							Rewards
						</a>
					</ul>
				) : null}
			</div>
			<div className={classNames.headerButtonsContainer}>
				<WalletButton />
				<BurgerMenu />
			</div>
			<FeedbackModal show={isFeedbackModalOpened} setShow={setIsFeedbackModalOpened} />
		</header>
	)
}
