import type { FC, MouseEvent } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import { useCallback, memo, useMemo } from 'react'
import { Chain } from './Chain/Chain'
import { useChainsStore } from '../../store/chains/useChainsStore'
import './ChainMenu.pcss'

type MenuProps = {
	activeChain: ILancaChain | null
	onChainClick: (chain: ILancaChain) => void
}

export const ChainMenu: FC<MenuProps> = memo(({ activeChain, onChainClick }) => {
	const { chains } = useChainsStore()

	const handleChainClick = useCallback(
		(chain: ILancaChain) => (event: MouseEvent) => {
			event.preventDefault()
			onChainClick(chain)
		},
		[onChainClick],
	)

	const chainsList = useMemo(
		() =>
			chains.map(chain => (
				<Chain
					key={chain.id}
					name={chain.name}
					logoURL={chain.logoURI}
					onClick={handleChainClick(chain)}
					isActive={activeChain?.id === chain.id}
				/>
			)),
		[chains, activeChain?.id, handleChainClick],
	)

	return (
		<div className="chain_menu">
			<h4 className="chain_menu_title">Chains</h4>
			<div className="chain_menu_container">
				<div className="chain_menu_grid">{chainsList}</div>
			</div>
		</div>
	)
})
