import type { ILancaChain } from '@lanca/sdk'
import { useCallback } from 'react'
import { shallow } from 'zustand/shallow'
import { useEvents } from '../../hooks/useEvents'
import { useChainStore } from './ChainsStore'
import { ChainChangedEvent, Event } from '../../types/events'

export const useChainActions = () => {
	const emitter = useEvents()
	const selectedChain = useChainStore(state => state.selectedChain)
	const actions = useChainStore(
		store => ({
			selectChain: store.selectChain,
			clearSelectedChain: store.clearSelectedChain,
		}),
		shallow,
	)

	const emitChainChangedEvent = (oldChainId: string | null, newChainId: string) => {
		emitter.emit(Event.ChainUpdated, {
			oldChainId,
			newChainId,
		} as ChainChangedEvent)
	}

	const selectChainWithEmittedEvents = useCallback(
		(newChain: ILancaChain) => {
			const oldChainId = selectedChain?.id || null
			const newChainId = newChain.id

			actions.selectChain(newChain)

			if (newChainId !== oldChainId) {
				emitChainChangedEvent(oldChainId, newChainId)
			}
		},
		[selectedChain, actions, emitter],
	)

	return {
		...actions,
		selectChain: selectChainWithEmittedEvents,
	}
}
