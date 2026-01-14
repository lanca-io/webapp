import type { FC } from 'react'
import { SwapWidget } from '../common/SwapWidget/SwapWidget'
import { ModalManager } from '../common/ModalManager/ModalManager'
import { config } from '../../constants/config'
import { Maintenance } from '../maintenance/Maintenance'
import './Swap.pcss'

export const Swap: FC = () => {
	if (config.APP_IS_NOT_AVAILABLE) {
		return <Maintenance />
	}
	return (
		<div className="swap">
			<SwapWidget />
			<ModalManager />
		</div>
	)
}
