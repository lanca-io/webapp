import classNames from './NotAccess.module.pcss'
import { Button } from '../../layout/buttons/Button/Button'
import { useAccount } from 'wagmi'

const links = [
	{
		title: 'Get access',
		link: 'https://send.lanca.io/s/clynb69qi0387y0ufi9myw20x',
	},
]

export const NotAccess = () => {
	const { address } = useAccount()

	const text = address ? 'You’re on the waitlist. Stay tuned!' : 'Connect your wallet to get access'

	return (
		<div className={classNames.notAccessContainer}>
			<h2>{text}</h2>
			<div className={classNames.buttonsContainer}>
				{address &&
					links.map(link => {
						return (
							<a rel="noreferrer" target="_blank" href={link.link} key={link.link}>
								<Button>{link.title}</Button>
							</a>
						)
					})}
			</div>
		</div>
	)
}

export default NotAccess
