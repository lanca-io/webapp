import type { FC, MouseEvent } from 'react'
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

const PoolActionContent: FC<PoolActionModalProps> = ({ onClose }) => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state

	const isClosable =
		allowance === PoolsActionStatus.Idle &&
		(queue === PoolsActionStatus.Idle ||
			queue === PoolsActionStatus.Success ||
			queue === PoolsActionStatus.Rejected ||
			queue === PoolsActionStatus.Failed)

	const isProcess =
		allowance !== PoolsActionStatus.Idle || queue !== PoolsActionStatus.Idle

	const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget && isClosable) {
			onClose()
		}
	}

	return (
		<div className="pool_action_modal_overlay" onClick={handleOverlayClick}>
			<div className="pool_action_modal_content">
				{isProcess ? (
					<ProcessWidget onClose={onClose} />
				) : (
					<InputWidget onClose={onClose} />
				)}
			</div>
		</div>
	)
}

export const PoolActionModal: FC<PoolActionModalProps> = ({
	type,
	onClose,
}) => {
	return createPortal(
		<PoolsActionProvider initialType={type}>
			<InputWidgetProvider>
				<PoolActionContent type={type} onClose={onClose} />
			</InputWidgetProvider>
		</PoolsActionProvider>,
		document.body,
	)
}
