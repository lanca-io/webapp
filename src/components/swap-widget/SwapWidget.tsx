import React, { useEffect } from 'react'
import classNames from './SwapWidget.module.pcss'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { SkeletonLoader } from '../layout/SkeletonLoader/SkeletonLoader'
import { useEvents } from '../../hooks/useEvents'
import { Event, ChainChangedEvent } from '../../types/events'
import { useLoadTokens } from '../../hooks/Loadables/useLoadBalances'

export const SwapWidget: React.FC = () => {
	const { chains, isLoading, error, selectedChain, selectChain } = useChainsStore()
	const { fetchTokensAndBalances } = useLoadTokens()
	const emitter = useEvents()

	fetchTokensAndBalances()

	useEffect(() => {
		const handleChainChanged = (event: ChainChangedEvent) => {
			console.log('ChainUpdated event:', event)
		}

		emitter.on(Event.ChainUpdated, handleChainChanged)

		return () => {
			emitter.off(Event.ChainUpdated, handleChainChanged)
		}
	}, [emitter])

	return (
		<div className={classNames['widget-container']}>
			{isLoading && <SkeletonLoader height={20} />}
			{error && <div>Error: {error}</div>}
			<div>Selected chain: {selectedChain?.name}</div>
			{!isLoading && !error && (
				<div className={classNames['chain-buttons']}>
					{chains.map(chain => (
						<button
							key={chain.id}
							onClick={() => selectChain(chain)}
							className={classNames['chain-button']}
						>
							{chain.name}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
