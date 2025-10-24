import { memo, useCallback, useMemo } from 'react'
import { Chain } from './Chain/Chain'
import { useChainsStore } from '../../../store/chains/useChainsStore'
import { ConceroChain } from '../../../store/chains/types'
import './ChainMenu.pcss'

type MenuProps = {
	activeChain: ConceroChain | null
	onChainClick: (chain: ConceroChain) => void
}

export const ChainMenu = memo(({ activeChain, onChainClick }: MenuProps): JSX.Element => {
	const { chains } = useChainsStore()

	const chainsArray = useMemo(() => Object.values(chains), [chains])

	console.log('chainsArray', chainsArray)

	const handleChainClick = useCallback(
		(chain: ConceroChain) => {
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
					{chainsArray.map(chain => (
						<Chain
							key={chain.id}
							name={chain.name}
							logoURL={chain.logo || ''}
							onClick={handleChainClick(chain)}
							isActive={activeChain?.id === chain.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
})
