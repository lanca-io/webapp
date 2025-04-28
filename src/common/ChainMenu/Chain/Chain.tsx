import type { FC, MouseEvent } from 'react'
import { memo, useCallback } from 'react'
import './Chain.pcss'

export type ChainProps = {
	name: string
	logoURL: string
	onClick: (event: MouseEvent) => void
	isActive: boolean
}

export const Chain: FC<ChainProps> = memo(({ name, logoURL, onClick, isActive }) => {
	const handleClick = useCallback(
		(event: MouseEvent) => {
			event.preventDefault()
			onClick(event)
		},
		[onClick],
	)

	return (
		<div
			className={`chain ${isActive ? 'active' : ''}`}
			onClick={handleClick}
			role="button"
			aria-selected={isActive}
		>
			<img className="chain__logo" src={logoURL} alt={name} />
			<h4 className="chain__name">{name}</h4>
		</div>
	)
})
