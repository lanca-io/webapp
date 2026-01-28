import type { FC } from 'react'
import { usePoolsActionContext } from './Reducer/Provider'
import { AnimatePresence, motion } from 'framer-motion'
import { PoolsActionStatus, PoolsActionType } from './Reducer/types'
import { ProcessWidget } from './ProcessWidget/ProcessWidget'
import { InputWidget } from './InputWidget/InputWidget'
import { PoolsActionProvider } from './Reducer/Provider'
import { InputWidgetProvider } from './InputWidget/Reducer/Provider'
import { createPortal } from 'react-dom'
import './PoolActionModal.pcss'

type PoolActionModalProps = {
	type: PoolsActionType
	onClose: () => void
}

const PoolActionContent: FC<PoolActionModalProps> = ({ onClose }) => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state
	const isProcess =
		allowance !== PoolsActionStatus.IDLE || queue !== PoolsActionStatus.IDLE

	return (
		<AnimatePresence mode="wait">
			{isProcess ? (
				<motion.div
					key="process"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.25 }}
				>
					<ProcessWidget onClose={onClose} />
				</motion.div>
			) : (
				<motion.div
					key="input"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: 20 }}
					transition={{ duration: 0.25 }}
				>
					<InputWidget onClose={onClose} />
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export const PoolActionModal: FC<PoolActionModalProps> = ({
	type,
	onClose,
}) => {
	const modal = (
		<PoolsActionProvider initialType={type}>
			<InputWidgetProvider>
				<div className="pool_action_modal_overlay">
					<PoolActionContent type={type} onClose={onClose} />
				</div>
			</InputWidgetProvider>
		</PoolsActionProvider>
	)

	return createPortal(modal, document.body)
}
