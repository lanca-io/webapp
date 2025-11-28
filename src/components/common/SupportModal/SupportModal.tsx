import type { ReactElement, MouseEvent } from 'react'
import { Button } from '@concero/ui-kit'
import { externalRoutes } from '@/constants'
import { Header } from './Header'
import './SupportModal.pcss'

type SupportModalProps = {
	isOpen: boolean
	onClose: () => void
}

export const SupportModal = ({ isOpen, onClose }: SupportModalProps): ReactElement | null => {
	if (!isOpen) return null

	const handleDialog = (e: MouseEvent<HTMLDivElement>): void => {
		e.stopPropagation()
	}

	return (
		<div className="support_modal_overlay" onClick={onClose} role="presentation">
			<div className="support_modal" onClick={handleDialog} role="dialog" aria-modal="true">
				<Header title="Contact Support" onClose={onClose} />
				<span className="support_modal_description">
					We apologize for any difficulties you encountered using our website. Please contact us on Discord,
					and we will help you.
				</span>

				<div className="support_modal_option">
					<Button
						variant="secondary"
						size="l"
						isFull
						onClick={() => window.open(externalRoutes.discord, '_blank', 'noopener,noreferrer')}
					>
						Open Discord
					</Button>
				</div>
			</div>
		</div>
	)
}
