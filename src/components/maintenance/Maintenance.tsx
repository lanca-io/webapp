import './Maintenance.pcss'

export const Maintenance = (): JSX.Element => {
	return (
		<div className="maintenance_wrapper">
			<div className="maintenance_banner">
				<span className="maintenance_banner_title">
					We will be back up and running shortly.
				</span>
				<span className="maintenance_banner_subtitle">
					Our infrastructure is currently undergoing maintenance to improve your
					experience. Thank you for your patience!
				</span>
			</div>
		</div>
	)
}
