import type { ILancaChain } from '@lanca/sdk'
import { memo, useCallback } from 'react'
import { Chain } from './Chain/Chain'
import { useChainsStore } from '../../../store/chains/useChainsStore'
import './ChainMenu.pcss'

type MenuProps = {
	activeChain: ILancaChain | null
	onChainClick: (chain: ILancaChain) => void
}

export const ChainMenu = memo(({ activeChain, onChainClick }: MenuProps): JSX.Element => {
	const { chains } = useChainsStore()

	const handleChainClick = useCallback(
		(chain: ILancaChain) => {
			return (e: React.MouseEvent) => {
				e.preventDefault()
				onChainClick(chain)
			}
		},
		[onChainClick],
	)

	return (
		<div className="chain_menu">
			<h4 className="chain_menu_title">Chains</h4>
			<div className="chain_menu_container">
				<div className="chain_menu_grid">
					{chains.map(chain => (
						<Chain
							key={chain.id}
							name={chain.name}
							logoURL={chain.logoURL || ''}
							onClick={handleChainClick(chain)}
							isActive={activeChain?.id === chain.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
})
