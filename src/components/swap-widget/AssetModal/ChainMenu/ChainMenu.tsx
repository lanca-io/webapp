import type { FC, MouseEvent } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import { useCallback } from 'react'
import { Chain } from './Chain/Chain'
import { ChainMenuProps } from './types'

import classNames from './ChainMenu.module.pcss'

export const ChainMenu: FC<ChainMenuProps> = ({ chains, activeChain, onChainClick }) => {
	const handleChainClick = useCallback(
		(chain: ILancaChain) => (event: MouseEvent) => {
			event.preventDefault()
			onChainClick(chain)
		},
		[onChainClick],
	)

	return (
		<div className={classNames['chain-menu']}>
			<h4 className={classNames['chain-menu__title']}>Chains</h4>
			<div className={classNames['chain-menu__container']}>
				<div className={classNames['chain-menu__grid']}>
					{chains.map(chain => (
						<Chain
							key={chain.id}
							name={chain.name}
							logoURL={chain.logoURI}
							onClick={handleChainClick(chain)}
							isActive={activeChain?.id === chain.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
