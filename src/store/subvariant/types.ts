import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'

export enum SplitSubvariantType {
	SWAP = 'swap',
	SEND = 'send',
}

export type SubvariantStateSlice = {
	state: SplitSubvariantType
}

export type SubvariantActions = {
	setState: (state: SplitSubvariantType) => void
}

export type SubvariantState = SubvariantStateSlice & SubvariantActions
export type SubvariantStore = UseBoundStoreWithEqualityFn<StoreApi<SubvariantState>>
