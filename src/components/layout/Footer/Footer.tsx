import classNames from './Footer.module.pcss'

export const Footer = () => {
	return (
		<footer className={classNames.footer}>
			<a className={classNames.link} href="https://concero.io/" target="_blank" rel="noreferrer">
				<div className={classNames.textContent}>
					<p>Powered by Concero</p>
				</div>
			</a>
		</footer>
	)
}
