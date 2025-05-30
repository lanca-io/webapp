import type { FC } from 'react'
import { SwapWidget } from '../common/SwapWidget/SwapWidget'
import { ModalManager } from '../common/ModalManager/ModalManager'
import './Swap.pcss'

export const Swap: FC = () => {
	return (
		<div className="swap">
			<SwapWidget />
			<ModalManager />
		</div>
	)
}
