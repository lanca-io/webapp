import type { FormState } from './types'
import { createWithEqualityFn } from 'zustand/traditional'
import { initialSrcChain, initialSrcToken, initialDstChain, initialDstToken } from './initialState'

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

			amount: '',
			setAmount: amount => set({ amount }),

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
