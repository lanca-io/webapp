import { ConceroLogo } from './conceroLogo'
import classNames from './ConceroWatermark.module.pcss'

export const ConceroWatermark = () => {
	return (
		<div className={classNames.conceroWatermark}>
			Powered by
			<a href="https://concero.io" target="_blank" rel="noreferrer">
				<ConceroLogo />
			</a>
		</div>
	)
}
