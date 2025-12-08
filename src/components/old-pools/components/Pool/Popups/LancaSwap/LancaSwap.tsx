import { BoltIcon } from '../../../../../../assets/icons/BoltIcon'
import { routes } from '../../../../../../constants/routes'
import { Button } from '../../../../../layout/buttons/Button/Button'
import classNames from './LancaSwap.module.pcss'

export const LancaSwap = (): JSX.Element => {
	return (
		<div className={classNames.container}>
			<div className={classNames.content}>
				<div className={classNames.iconWrapper}>
					<BoltIcon />
				</div>
				<div className={classNames.title}>
					<p>Swap any token for USDC on Base by Lanca</p>
				</div>
			</div>
			<a href={routes.home} target="_blank" rel="noreferrer">
				<Button size="md" variant="secondaryColor">
					Swap
				</Button>
			</a>
		</div>
	)
}
