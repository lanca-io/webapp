import { DepreciationWidget } from '../../../common/DepreciationWidget/DepreciationWidget'
import classNames from './PoolLanding.module.pcss'

export const PoolLanding = (): JSX.Element => {
	return (
		<div className={classNames.container}>
			<DepreciationWidget
				description={
					'We’re sunsetting the current pools. If you provided liquidity, please withdraw it — pool support will end soon.'
				}
			/>
		</div>
	)
}
