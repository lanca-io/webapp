import { memo, useCallback } from 'react'
import './ChainSelection.pcss'

type ChainSelectionProps = {
	logoURI?: string
	name?: string
	onClick?: () => void
}

export const ChainSelection = memo(({ logoURI, name, onClick }: ChainSelectionProps): JSX.Element => {
	const handleClick = useCallback(() => {
		onClick?.()
	}, [onClick])

	return (
		<div className="chain_selection" onClick={handleClick}>
			<img src={logoURI} alt={name || 'Chain logo'} className="chain_selection_logo" />
			<p className="chain_selection_name">{name}</p>
		</div>
	)
})
