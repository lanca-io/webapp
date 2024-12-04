import { type ReactElement, memo } from 'react'
import { IconButton } from '../../../../layout/buttons/IconButton/IconButton'
import { SwapIcon } from '../../../../../assets/icons/SwapIcon'
import './DividerSection.pcss'

interface SeparatorSectionProps {
	action: () => void
}

const DividerSection = ({ action }: SeparatorSectionProps): ReactElement => {
	return (
		<div className="divider-section">
			<div className="divider-section__divider" />
			<IconButton size="sm" variant="secondary" className="divider-section__icon-button" onClick={action}>
				<SwapIcon />
			</IconButton>
			<div className="divider-section__divider" />
		</div>
	)
}

export default memo(DividerSection)
