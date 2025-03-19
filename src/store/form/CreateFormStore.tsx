import type { FormState } from './types'
import { initialDstChain, initialDstToken, initialSrcChain, initialSrcToken } from './initialState'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateFormStore = () =>
	createWithEqualityFn<FormState>(
		set => ({
			srcChain: initialSrcChain,
			dstChain: initialDstChain,
			setSrcChain: chain => set({ srcChain: chain }),
			setDstChain: chain => set({ dstChain: chain }),

			srcToken: initialSrcToken,
			dstToken: initialDstToken,
			setSrcToken: token => set({ srcToken: token }),
			setDstToken: token => set({ dstToken: token }),

			amount: null,
			setAmount: amount => set({ amount: amount !== null ? amount.toString() : null }),
			clearAmount: () => set({ amount: null }),

			error: null,
			setError: error => set({ error: error !== null ? error.toString() : null }),

			swapChainsAndTokens: () =>
				set(state => ({
					srcChain: state.dstChain,
					dstChain: state.srcChain,
					srcToken: state.dstToken,
					dstToken: state.srcToken,
				})),
		}),
		Object.is,
	)
