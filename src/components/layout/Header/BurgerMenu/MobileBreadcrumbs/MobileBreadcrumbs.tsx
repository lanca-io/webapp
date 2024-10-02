import classNames from './MobileBreadcrumbs.module.pcss'
import { Button } from '../../../../buttons/Button/Button'

export function MobileBreadcrumbs() {
	return (
		<ul className={classNames.container}>
			<a href="https://app.concero.io/rewards" className={classNames.link}>
				<Button className="w-full" variant={'tetrary'} size={'md'}>
					Rewards
				</Button>
			</a>
			<a href="https://app.concero.io/pool" className={classNames.link}>
				<Button variant={'tetrary'} size={'md'}>
					Provide Liquidity
				</Button>
			</a>
			<div className={classNames.separator} />
		</ul>
	)
}
