import classNames from './PoolScreen.module.pcss'
import { config } from '../../../constants/config'
import { TechWorksScreen } from '../TechWorksScreen/TechWorksScreen'
import { PoolLanding } from '../../pools/components/PoolLanding/PoolLanding'
import { Footer } from '../../layout/Footer/Footer'

export const PoolScreen = () => {
	const { POOLS_ARE_NOT_AVAILABLE } = config

	return !POOLS_ARE_NOT_AVAILABLE ? (
		<div className={classNames.poolScreen}>
			<div className={classNames.poolScreenContainer}>
				<PoolLanding />
			</div>
			<div className={classNames.footerWrapper}>
				<Footer />
			</div>
		</div>
	) : (
		<TechWorksScreen />
	)
}
