import type { FC } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import { Chain } from './Chain/Chain'
import { useChainStore } from '../../../../store/chains/ChainsStore'
import classNames from './ChainMenu.module.pcss'

export const ChainMenu: FC = () => {
	const chains = useChainStore(state => state.chains)
	const sourcChain = useChainStore(state => state.sourceChain)
	const selectSourceChain = useChainStore(state => state.selectSourceChain)

	const handleChainClick = (chain: ILancaChain) => {
		selectSourceChain(chain)
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
							isActive={sourcChain?.id === chain.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
