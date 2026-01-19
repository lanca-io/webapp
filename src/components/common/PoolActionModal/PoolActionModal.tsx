import type { FC } from 'react'
import { PoolActionType } from '@/store/pool-action-execution/types'

type PoolActionModalProps = {
	type: PoolActionType
	onClose: () => void
}

export const PoolActionModal: FC<PoolActionModalProps> = ({
	onClose,
}): JSX.Element => {
	return (
		<div
			className="pool_action_modal_overlay"
			onClick={onClose}
			role="presentation"
		></div>
	)
}
