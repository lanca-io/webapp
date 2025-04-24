import type { FC } from 'react'
import { memo, useCallback } from 'react'
import { Button } from '@concero/ui-kit'
import './ExpandButton.pcss'

export type ExpandButtonProps = {
	isExpanded: boolean
	onToggle: (expanded: boolean) => void
}
export const ExpandButton: FC<ExpandButtonProps> = memo(({ isExpanded, onToggle }) => {
	const handleToggle = useCallback(() => {
		onToggle(!isExpanded)
	}, [isExpanded, onToggle])

	return (
		<div className="expand_button_container">
			<Button size="s" variant="secondary" onClick={handleToggle} className="expand_button">
				{isExpanded ? 'Show Less' : 'Show More'}
			</Button>
		</div>
	)
})
