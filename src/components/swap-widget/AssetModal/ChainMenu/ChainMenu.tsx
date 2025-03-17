import type { FC } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import { useMemo, useCallback } from 'react'
import { useChainsStore } from '../../../../store/chains/useChainsStore'
import { useFormStore } from '../../../../store/form/useFormStore'
import { Chain } from './Chain/Chain'
import { ChainMenuProps } from './types'
import classNames from './ChainMenu.module.pcss'

export const ChainMenu: FC<ChainMenuProps> = ({ direction }) => {
	const { chains } = useChainsStore()
	const { srcChain, dstChain, setSrcChain, setDstChain } = useFormStore()

	const handleChainClick = useCallback(
		(chain: ILancaChain) => {
			if (direction === 'from') {
				setSrcChain(chain)
			} else {
				setDstChain(chain)
			}
		},
		[direction, setSrcChain, setDstChain],
	)

	const activeChain = useMemo(() => (direction === 'from' ? srcChain : dstChain), [direction, srcChain, dstChain])

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
							isActive={activeChain?.id === chain.id}
						/>
					))}
				</div>
			</div>
		</div>
	)
}
