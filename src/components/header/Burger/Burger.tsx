import type { FC, ReactNode } from 'react'
import type { TButtonVariant, TButtonSize } from '@concero/ui-kit'
import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconButton, Button } from '@concero/ui-kit'
import { IconBurger } from '../../../assets/icons/IconBurger'
import { TrophyIcon } from '../../../assets/icons/TrophyIcon'
import { TrailArrowRightIcon } from '../../../assets/icons/TrailArrowRightIcon'
import { ContactSupportModal } from '../../modals/ContactSupportModal/ContactSupportModal'
import { routes } from '../../../constants/routes'
import { CloseIcon } from '../../../assets/icons/CloseIcon'
import './Burger.pcss'

type BurgerProps = {
	isMenuOpen?: boolean
	onToggleMenu?: () => void
}

type MenuItem = {
	key: string
	label: string
	leftIcon?: ReactNode
	trailIcon?: ReactNode
	variant?: TButtonVariant
	size?: TButtonSize
	isFull?: boolean
	to: string
	dividerBefore?: boolean
	dividerAfter?: boolean
}

export const Burger: FC<BurgerProps> = ({ isMenuOpen = false, onToggleMenu }) => {
	const navigate = useNavigate()
	const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)

	const menuItems: MenuItem[] = [
		{
			key: 'swap',
			label: 'Swap',
			trailIcon: <TrailArrowRightIcon />,
			variant: 'tetrary',
			size: 'm',
			isFull: true,
			to: routes.home,
		},
		{
			key: 'liquidity',
			label: 'Provide Liquidity',
			trailIcon: <TrailArrowRightIcon />,
			variant: 'tetrary',
			size: 'm',
			isFull: true,
			to: routes.pools,
		},
		{
			key: 'rewards',
			label: 'Rewards Portal',
			leftIcon: <TrophyIcon color="var(--color-grey-600)" />,
			trailIcon: <TrailArrowRightIcon />,
			variant: 'tetrary',
			size: 'm',
			isFull: true,
			dividerBefore: true,
			dividerAfter: true,
			to: 'https://app.concero.io/rewards',
		},
	]

	const handleNavigation = (to: string) => {
		if (to.startsWith('http')) {
			window.open(to, '_blank', 'noopener,noreferrer')
		} else {
			navigate(to)
			if (onToggleMenu) {
				onToggleMenu()
			}
		}
	}

	const handleSupportClick = () => {
		if (onToggleMenu) {
			onToggleMenu()
		}

		setIsSupportModalOpen(true)
	}

	return (
		<div className="burger">
			<IconButton variant="secondary" onClick={onToggleMenu} isFocused={isMenuOpen}>
				{isMenuOpen ? <CloseIcon /> : <IconBurger />}
			</IconButton>
			{isMenuOpen && (
				<div className="burger_menu">
					<div className="burger_menu_content">
						{menuItems.map(
							({
								key,
								label,
								leftIcon,
								trailIcon,
								variant,
								size,
								isFull,
								dividerBefore,
								dividerAfter,
								to,
							}) => (
								<Fragment key={key}>
									{dividerBefore && <div className="burger_menu_divider" />}
									<div className="burger_menu_item">
										<Button
											variant={variant}
											size={size}
											isFull={isFull}
											leftIcon={leftIcon}
											trailIcon={trailIcon ? { show: true, icon: trailIcon } : undefined}
											onClick={() => handleNavigation(to)}
										>
											{label}
										</Button>
									</div>
									{dividerAfter && <div className="burger_menu_divider" />}
								</Fragment>
							),
						)}
					</div>
					<Button variant="secondary_color" size="l" isFull onClick={handleSupportClick}>
						Contact Support
					</Button>
				</div>
			)}
			{isSupportModalOpen && (
				<ContactSupportModal isShow={isSupportModalOpen} setIsShow={() => setIsSupportModalOpen(false)} />
			)}
		</div>
	)
}
