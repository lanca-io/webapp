import { Link } from 'react-router-dom'
import classNames from './Header.module.pcss'

export function ComingSoonLinks() {
	return (
		<div className={classNames.comingSoonContainer}>
			<Link className={classNames.comingSoon} to="#">
				Earn
			</Link>
			<Link className={classNames.comingSoon} to="#">
				Rewards
			</Link>
		</div>
	)
}
