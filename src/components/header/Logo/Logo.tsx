import './Logo.pcss'

export const Logo = (): JSX.Element => {
	const imgPath: string = '/Header/Lanca.svg'
	const imgAlt: string = 'Lanca Logo'

	return (
		<div className="header_logo_container">
			<img
				src={imgPath}
				alt={imgAlt}
				className="header_logo_img"
				loading="lazy"
			/>
		</div>
	)
}
