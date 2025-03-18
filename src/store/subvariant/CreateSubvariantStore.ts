import type { SplitSubvariantProps } from './types'
import type { SplitSubvariantState } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateSplitSubvariantStore = ({ state = 'swap' }: SplitSubvariantProps) =>
	createWithEqualityFn<SplitSubvariantState>(
		set => ({
			state,
			setState(state) {
				set(() => ({
					state,
				}))
			},
		}),
		Object.is,
	)
