import classNames from './PoolScreen.module.pcss'
import { config } from '../../../constants/config'
import { TechWorksScreen } from '../TechWorksScreen/TechWorksScreen'
import { ConceroPool } from '../../pools/components/ConceroPool/ConceroPool'
import { Footer } from '../../layout/Footer/Footer'

export const USDCPoolScreen = () => {
	const { POOLS_ARE_NOT_AVAILABLE } = config

	return !POOLS_ARE_NOT_AVAILABLE ? (
		<div className={classNames.poolScreen}>
			<div className={classNames.poolScreenContainer}>
				<ConceroPool />
			</div>
			<div className={classNames.footerWrapper}>
				<Footer />
			</div>
		</div>
	) : (
		<TechWorksScreen />
	)
}
