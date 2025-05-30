import classNames from './BurgerMenu.module.pcss'
import { Button } from '../../buttons/Button/Button'
import { type KeyboardEvent, useEffect, useState } from 'react'
import { LanguageModal } from '../../../modals/LanguageModal/LanguageModal'
import { animated, useSpring } from '@react-spring/web'
import { useTranslation } from 'react-i18next'
import { useQuery } from '../../../../hooks/useQuery'
import { MobileBreadcrumbs } from './MobileBreadcrumbs/MobileBreadcrumbs'
import { ContactSupportModal } from '../../../modals/ContactSupportModal/ContactSupportModal'
import { IconButton } from '../../buttons/IconButton/IconButton'
import { IconBurger } from '../../../../assets/icons/IconBurger'
import { LanguageIcon } from '../../../../assets/icons/LanguageIcon'

export function BurgerMenu() {
	const [isMenuOpened, setIsMenuOpened] = useState(false)
	const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false)
	const [isContactSupportModalVisible, setIsModalContactSupportModalVisible] = useState(false)
	const isMobile = useQuery('mobile')
	const { t } = useTranslation()

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			setIsMenuOpened(false)
		}
	}

	const fadeAnimation = useSpring({
		opacity: isMenuOpened ? 1 : 0,
		translateY: isMenuOpened ? 0 : -100,
		config: { easing: 'spring', mass: 1, tension: 600, friction: 30 },
		pointerEvents: isMenuOpened ? 'auto' : 'none',
		from: { opacity: 0, pointerEvents: 'none' },
	})

	const overlayFadeAnimation = useSpring({
		opacity: isMenuOpened ? 1 : 0,
		config: { easing: 'spring', mass: 1, tension: 600, friction: 30 },
		pointerEvents: isMenuOpened ? 'auto' : 'none',
		from: { opacity: 0, pointerEvents: 'none' },
	})

	useEffect(() => {
		if (isMenuOpened) {
			document.body.style.overflowY = 'hidden'
			document.addEventListener('keydown', handleKeyDown)
		} else {
			document.body.style.removeProperty('overflow-y')
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isMenuOpened])

	return (
		<div className={classNames.container}>
			<IconButton
				variant="secondary"
				onClick={() => {
					setIsMenuOpened(prev => !prev)
				}}
			>
				<IconBurger />
			</IconButton>
			<animated.div
				style={overlayFadeAnimation}
				className={classNames.overlay}
				onClick={() => {
					setIsMenuOpened(false)
				}}
			>
				<animated.div style={fadeAnimation} className={classNames.menuContainer}>
					<div>
						{isMobile ? <MobileBreadcrumbs /> : null}
						<ul className={classNames.listContainer}>
							<li>
								<Button
									leftIcon={<LanguageIcon />}
									variant={'tetrary'}
									size={'md'}
									onClick={(e: MouseEvent) => {
										setIsLanguageModalVisible(true)
										e.stopPropagation()
									}}
								>
									{t('header.menu.changeLanguage')}
								</Button>
							</li>
						</ul>
					</div>
					<Button
						isFull={true}
						size={'lg'}
						variant="secondaryColor"
						onClick={() => {
							setIsModalContactSupportModalVisible(true)
						}}
					>
						{t('header.menu.contactSupport')}
					</Button>
				</animated.div>
			</animated.div>
			<LanguageModal show={isLanguageModalVisible} setShow={setIsLanguageModalVisible} />
			<ContactSupportModal
				isShow={isContactSupportModalVisible}
				setIsShow={setIsModalContactSupportModalVisible}
			/>
		</div>
	)
}
