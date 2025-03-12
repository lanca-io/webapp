import type { FC } from 'react'
import type { ModalHeaderProps } from './types'
import { IconButton } from '../../../../layout/buttons/IconButton/IconButton'
import { TrailArrowLeftIcon } from '../../../../../assets/icons/TrailArrowLeftIcon'

import classNames from './ModalHeader.module.pcss'

export const ModalHeader: FC<ModalHeaderProps> = ({ title, onClose }) => {
	return (
		<div className={classNames['modal-header']}>
			<IconButton onClick={onClose} variant="secondary" size="md">
				<TrailArrowLeftIcon />
			</IconButton>
			<h4 className={classNames['modal-header__title']}>{title}</h4>
		</div>
	)
}
