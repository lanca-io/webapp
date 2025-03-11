import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { PropsWithChildren } from 'react'
import type { StoreApi } from 'zustand/vanilla'

export type SplitSubvariant = 'swap' | 'send' | 'pool'

export interface SplitSubvariantState {
	state?: SplitSubvariant
	setState: (state: SplitSubvariant) => void
}

export type SplitSubvariantStore = UseBoundStoreWithEqualityFn<StoreApi<SplitSubvariantState>>

export interface SplitSubvariantProps {
	state?: SplitSubvariant
}

export type SplitSubvariantProviderProps = PropsWithChildren<SplitSubvariantProps>
