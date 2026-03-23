import type { FC } from 'react'
import { DepreciationWidget } from '../common/DepreciationWidget/DepreciationWidget'
import { config } from '../../constants/config'
import { TechWorksScreen } from '../screens/TechWorksScreen/TechWorksScreen'
import './Swap.pcss'

export const Swap: FC = () => {
	if (config.APP_IS_NOT_AVAILABLE) {
		return <TechWorksScreen />
	}
	return (
		<div className="swap">
			<DepreciationWidget description="We’re sunsetting the current pools and pausing swaps and bridges. If you provided liquidity, please withdraw it — pool support will end soon." />
		</div>
	)
}
