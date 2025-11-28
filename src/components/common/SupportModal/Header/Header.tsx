import type { ReactElement, MouseEventHandler } from 'react'
import { IconButton } from '@concero/ui-kit'
import { ArrowLeftIcon } from '@/assets/icons/ArrowLeftIcon'
import { CloseIcon } from '@/assets/icons/CloseIcon'
import './Header.pcss'

type HeaderProps = {
	title: string
	hasBack?: boolean
	onBack?: MouseEventHandler<HTMLButtonElement>
	onClose: MouseEventHandler<HTMLButtonElement>
}

export const Header = ({ title, hasBack = false, onBack, onClose }: HeaderProps): ReactElement => (
	<div className="support_modal_header">
		{hasBack ? (
			<IconButton
				variant="secondary"
				size="m"
				onClick={onBack}
				aria-label="Go back"
				className="support_modal_header_button"
			>
				<ArrowLeftIcon />
			</IconButton>
		) : (
			<div className="support_modal_header_placeholder" />
		)}

		<span className="support_modal_title">{title}</span>

		<IconButton
			variant="secondary"
			size="m"
			onClick={onClose}
			aria-label="Close support modal"
			className="support_modal_header_button"
		>
			<CloseIcon />
		</IconButton>
	</div>
)
