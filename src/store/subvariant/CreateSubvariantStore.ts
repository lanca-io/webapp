import type { SubvariantState } from './types'
import { SplitSubvariantType } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateSubvariantStore = () =>
	createWithEqualityFn<SubvariantState>(
		set => ({
			state: SplitSubvariantType.SWAP,
			setState: (state: SplitSubvariantType) => {
				set({ state })
			},
		}),
		Object.is,
	)
