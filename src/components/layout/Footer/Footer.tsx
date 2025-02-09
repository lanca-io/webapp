import { Concero } from '../../../assets/icons/Concero'
import classNames from './Footer.module.pcss'

export const Footer = () => {
	return (
		<footer className={classNames.footer}>
			<div className={classNames.iconWrapper}>
				<Concero />
			</div>
			<div className={classNames.textContent}>
				<p>Powered by Concero</p>
			</div>
		</footer>
	)
}
