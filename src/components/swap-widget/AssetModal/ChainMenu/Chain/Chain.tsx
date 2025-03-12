import type { FC } from 'react'
import type { ChainProps } from './types'
import classNames from './Chain.module.pcss'

export const Chain: FC<ChainProps> = ({ name, logoURL, onClick, isActive }) => {
	return (
		<div className={`${classNames['chain']} ${isActive ? classNames['active'] : ''}`} onClick={onClick}>
			<img className={classNames['chain__logo']} src={logoURL} alt={name} />
			<h4 className={classNames['chain__name']}>{name}</h4>
		</div>
	)
}
