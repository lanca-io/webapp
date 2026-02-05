import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { IconButton } from '@concero/ui-kit'
import { TrailArrowLeftIcon } from '@/assets/TrailArrowLeftIcon'
import './Header.pcss'

export type Header = {
	title: string
	onClose: () => void
}

export const Header: FC<Header> = ({ title, onClose }) => {
	const handleClose = useCallback(() => {
		onClose()
	}, [onClose])

	const icon = useMemo(() => <TrailArrowLeftIcon />, [])

	const closeButton = useMemo(
		() => (
			<IconButton onClick={handleClose} variant="secondary" size="m">
				{icon}
			</IconButton>
		),
		[handleClose, icon],
	)

	return (
		<div className="pool_action_input_form_header">
			{closeButton}
			<h4 className="pool_action_input_form_header_title">{title}</h4>
		</div>
	)
}
