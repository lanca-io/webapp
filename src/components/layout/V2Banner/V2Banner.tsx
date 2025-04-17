import type { FC } from 'react'
import { Concero } from '../../../assets/icons/Concero'
import { Button } from '../buttons/Button/Button'
import classNames from './V2Banner.module.pcss'

export const V2Banner: FC = () => {
	const handleOpenTestnet = () => {
		window.open('https://testnet.concero.io/', '_blank', 'noopener,noreferrer')
	}

	return (
		<div className={classNames.v2_banner}>
			<div className={classNames.v2_banner_content}>
				<div className={classNames.v2_banner_icon}>
					<Concero color="#7E54F1" />
				</div>
				<h5 className={classNames.v2_banner_title}>Concero Testnet is live!</h5>
			</div>
			<div className={classNames.v2_banner_action}>
				<Button className={classNames.v2_banner_button} onClick={handleOpenTestnet}>
					Open
				</Button>
			</div>
		</div>
	)
}
