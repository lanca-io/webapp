import type { FC } from 'react'
import { useState } from 'react'
import { IconButton } from '@concero/ui-kit'
import { IconBurger } from '../../../assets/icons/IconBurger'
import { Button } from '@concero/ui-kit'
import { TrophyIcon } from '../../../assets/icons/TrophyIcon'
import './Burger.pcss'

export const Burger: FC = (): JSX.Element => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev)
	}

	return (
		<div className="burger">
			<IconButton variant="secondary" onClick={toggleMenu}>
				<IconBurger />
			</IconButton>
			{isMenuOpen && (
				<div className="burger_menu">
					<div className="burger_menu_content">
						<div className="burger_menu_item">
							<Button variant="tetrary" size="m" isFull showTrailIcon>
								Swap
							</Button>
						</div>
						<div className="burger_menu_item">
							<Button variant="tetrary" size="m" isFull showTrailIcon>
								Provide Liquidity
							</Button>
						</div>
						<div className="burger_menu_divider" />
						<div className="burger_menu_item">
							<Button
								variant="tetrary"
								size="m"
								isFull
								showTrailIcon
								leftIcon={<TrophyIcon color="var(--color-grey-600)" />}
							>
								Rewards Portal
							</Button>
						</div>
						<div className="burger_menu_divider" />
					</div>
					<Button variant="secondary_color" size="l" isFull>
						Contact Support
					</Button>
				</div>
			)}
		</div>
	)
}
