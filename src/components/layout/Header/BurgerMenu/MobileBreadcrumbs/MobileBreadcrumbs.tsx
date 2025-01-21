import classNames from './MobileBreadcrumbs.module.pcss'
import { Button } from '../../../buttons/Button/Button'
import { routes } from '../../../../../constants/routes'

export function MobileBreadcrumbs() {
	return (
		<ul className={classNames.container}>
			<a className={classNames.link} href={routes.home} rel="noreferrer">
				<Button size="md" variant="tetrary">
					Swap
				</Button>
			</a>
			<a className={classNames.link} href={routes.pools} rel="noreferrer">
				<Button size="md" variant="tetrary">
					Provide Liquidity
				</Button>
			</a>
			<div className={classNames.separator} />
		</ul>
	)
}
