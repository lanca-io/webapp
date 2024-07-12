import classNames from './NotAccess.module.pcss'
import { Button } from '../../buttons/Button/Button'
import { IconBrandDiscord, IconBrandMedium, IconBrandTwitter } from '@tabler/icons-react'

const links = [
	{
		title: 'Twitter',
		link: 'https://x.com/lanca_io',
		icon: <IconBrandTwitter size={18} />,
	},
	{
		title: 'Discord',
		link: 'https://discord.com/channels/1155792755105214535',
		icon: <IconBrandDiscord size={18} />,
	},
	{
		title: 'Medium',
		link: 'https://medium.com/@concero',
		icon: <IconBrandMedium size={18} />,
	},
]

export const NotAccess = () => {
	return (
		<div className={classNames.notAccessContainer}>
			<h2>You’re on the waitlist. Stay tuned!</h2>
			<div className={classNames.buttonsContainer}>
				{links.map(link => {
					return (
						<a rel="noreferrer" target="_blank" href={link.link} key={link.link}>
							<Button leftIcon={link.icon}>{link.title}</Button>
						</a>
					)
				})}
			</div>
		</div>
	)
}

export default NotAccess
