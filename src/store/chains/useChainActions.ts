import type { ILancaChain } from '@lanca/sdk'
import { useCallback, useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { useEvents } from '../../hooks/useEvents'
import { useChainStore } from './ChainsStore'
import { ChainChangedEvent, Event } from '../../types/events'

export const useChainActions = () => {
	const emitter = useEvents()
	const selectedChain = useChainStore(state => state.selectedChain)
	const { selectChain, clearSelectedChain } = useChainStore(
		store => ({
			selectChain: store.selectChain,
			clearSelectedChain: store.clearSelectedChain,
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

	const selectChainWithEmittedEvents = useCallback(
		(newChain: ILancaChain) => {
			const oldChainId = selectedChain?.id || null
			const newChainId = newChain.id

			selectChain(newChain)

			if (newChainId !== oldChainId) {
				emitChainChangedEvent(oldChainId, newChainId)
			}
		},
		[selectedChain, selectChain, emitChainChangedEvent],
	)

	return useMemo(
		() => ({
			selectChain: selectChainWithEmittedEvents,
			clearSelectedChain,
		}),
		[selectChainWithEmittedEvents, clearSelectedChain],
	)
}
