import type { FormState } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateFormStore = () =>
	createWithEqualityFn<FormState>(
		set => ({
			srcChain: null,
			dstChain: null,
			setSrcChain: chain => set({ srcChain: chain }),
			setDstChain: chain => set({ dstChain: chain }),

			srcToken: null,
			dstToken: null,
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
