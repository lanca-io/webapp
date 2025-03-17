import type { FC, MouseEvent } from 'react'
import type { ChainProps } from './types'
import { memo, useCallback } from 'react'
import classNames from './Chain.module.pcss'

export const Chain: FC<ChainProps> = memo(({ name, logoURL, onClick, isActive }) => {
	const handleClick = useCallback(
		(event: MouseEvent) => {
			event.preventDefault()
			onClick(event)
		},
		[onClick],
	)

	return (
		<div className={`${classNames['chain']} ${isActive ? classNames['active'] : ''}`} onClick={handleClick}>
			<img className={classNames['chain__logo']} src={logoURL} alt={name} />
			<h4 className={classNames['chain__name']}>{name}</h4>
		</div>
	)
})
