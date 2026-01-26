import type { FC } from 'react'
import { usePoolsActionContext } from './Reducer/Provider'
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

const PoolActionContent: FC<PoolActionModalProps> = ({ type, onClose }) => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state

	const isProcess =
		allowance !== PoolsActionStatus.IDLE || queue !== PoolsActionStatus.IDLE

	return (
		<>
			{isProcess ? (
				<ProcessWidget onClose={onClose} />
			) : (
				<InputWidget type={type} onClose={onClose} />
			)}
		</>
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
