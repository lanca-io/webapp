import type { ILancaChain } from '@lanca/sdk'
import { useCallback, useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useEvents } from '../../hooks/useEvents'
import { useChainStore } from './ChainsStore'
import { ChainChangedEvent, Event } from '../../types/events'

export const useChainActions = () => {
	const emitter = useEvents()
	const sourceChain = useChainStore(state => state.sourceChain)
	const destinationChain = useChainStore(state => state.destinationChain)
	const { selectSourceChain, selectDestinationChain, clearSourceChain, clearDestinationChain, swapChains } =
		useChainStore(
			store => ({
				selectSourceChain: store.selectSourceChain,
				selectDestinationChain: store.selectDestinationChain,
				clearSourceChain: store.clearSourceChain,
				clearDestinationChain: store.clearDestinationChain,
				swapChains: store.swapChains,
			}),
			shallow,
		)

	const emitChainChangedEvent = useCallback(
		(oldChainId: string | null, newChainId: string) => {
			emitter.emit(Event.ChainUpdated, {
				oldChainId,
				newChainId,
			} as ChainChangedEvent)
		},
		[emitter],
	)

	const selectSourceChainWithEmittedEvents = useCallback(
		(newChain: ILancaChain) => {
			const oldChainId = sourceChain?.id || null
			const newChainId = newChain.id

			selectSourceChain(newChain)

			if (newChainId !== oldChainId) {
				emitChainChangedEvent(oldChainId, newChainId)
			}
		},
		[sourceChain, selectSourceChain, emitChainChangedEvent],
	)

	const selectDestinationChainWithEmittedEvents = useCallback(
		(newChain: ILancaChain) => {
			const oldChainId = destinationChain?.id || null
			const newChainId = newChain.id

			selectDestinationChain(newChain)

			if (newChainId !== oldChainId) {
				emitChainChangedEvent(oldChainId, newChainId)
			}
		},
		[destinationChain, selectDestinationChain, emitChainChangedEvent],
	)

	return useMemo(
		() => ({
			selectSourceChain: selectSourceChainWithEmittedEvents,
			selectDestinationChain: selectDestinationChainWithEmittedEvents,
			clearSourceChain,
			clearDestinationChain,
			swapChains,
		}),
		[
			selectSourceChainWithEmittedEvents,
			selectDestinationChainWithEmittedEvents,
			clearSourceChain,
			clearDestinationChain,
			swapChains,
		],
	)
}
