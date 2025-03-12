import type { FC } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import { Chain } from './Chain/Chain'
import { useChainsStore } from '../../../../store/chains/useChainsStore'
import classNames from './ChainMenu.module.pcss'

export const ChainMenu: FC = () => {
	const { chains, selectedChain, selectChain } = useChainsStore()

	const handleChainClick = (chain: ILancaChain) => {
		selectChain(chain)
	}

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
							onClick={() => handleChainClick(chain)}
							isActive={selectedChain?.id === chain.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
