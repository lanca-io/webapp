import { memo, useCallback } from 'react'
import './Chain.pcss'

type ChainProps = {
	name: string
	logoURL: string
	onClick: (event: React.MouseEvent) => void
	isActive: boolean
}

export const Chain = memo(({ name, logoURL, onClick, isActive }: ChainProps): JSX.Element => {
	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()
			onClick(e)
		},
		[onClick],
	)

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (['Enter', ' '].includes(e.key)) {
				e.preventDefault()
				onClick(e as unknown as React.MouseEvent)
			}
		},
		[onClick],
	)

	return (
		<div
			className={`chain ${isActive ? 'active' : ''}`}
			onClick={handleClick}
			onKeyDown={handleKeyPress}
			role="button"
			aria-selected={isActive}
			tabIndex={0}
			aria-label={`Select ${name} network`}
		>
			<img className="chain__logo" src={logoURL} alt={name} loading="lazy" draggable={false} />
			<h4 className="chain__name">{name}</h4>
		</div>
	)
})
