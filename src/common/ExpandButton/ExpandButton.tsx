import type { FC } from 'react'
import { useCallback, useMemo } from 'react'
import { Button } from '@concero/ui-kit'
import './ExpandButton.pcss'

type ExpandProps = {
	isExpanded: boolean
	onToggle: (expanded: boolean) => void
}

export const ExpandButton: FC<ExpandProps> = ({ isExpanded, onToggle }) => {
	const handleToggle = useCallback(() => {
		onToggle(!isExpanded)
	}, [isExpanded, onToggle])

	const button = useMemo(
		() => (
			<Button size="s" variant="secondary" onClick={handleToggle} className="expand_button">
				{isExpanded ? 'Show Less' : 'Show More'}
			</Button>
		),
		[isExpanded, handleToggle],
	)

	return <div className="expand_button_container">{button}</div>
}

ExpandButton.displayName = 'ExpandButton'
