import type { Location, NavigateFunction } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@concero/ui-kit'
import { routes } from '../../../constants'
import './Navigation.pcss'

export const Navigation = (): JSX.Element => {
	const location: Location = useLocation()
	const navigate: NavigateFunction = useNavigate()

	const isHome: boolean = location.pathname === routes.home
	const isPools: boolean = location.pathname === routes.pools

	return (
		<div className="header_navigation">
			<Button
				variant={isHome ? 'secondary' : 'tetrary'}
				size="m"
				onClick={() => navigate(routes.home)}
			>
				Swap & Bridge
			</Button>
			<Button
				variant={isPools ? 'secondary' : 'tetrary'}
				size="m"
				onClick={() => navigate(routes.pools)}
			>
				Provide Liquidity
			</Button>
		</div>
	)
}
