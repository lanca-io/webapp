import classNames from './PoolScreen.module.pcss'
import { config } from '../../../constants/config'
import { TechWorksScreen } from '../TechWorksScreen/TechWorksScreen'
import { ConceroPool } from '../../pools/ConceroPool/ConceroPool'

export const PoolScreen = () => {
	const { POOLS_ARE_NOT_AVAILABLE } = config

	return !POOLS_ARE_NOT_AVAILABLE ? (
		<div className={classNames.poolScreen}>
			<div className={classNames.poolScreenContainer}>
				<ConceroPool />
			</div>
		</div>
	) : (
		<TechWorksScreen />
	)
}
