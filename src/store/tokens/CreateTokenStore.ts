import type { TokensState } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateTokensStore = () =>
	createWithEqualityFn<TokensState>(
		set => ({
			sourceTokens: [],
			destinationTokens: [],

			selectedSourceToken: null,
			selectedDestinationToken: null,

			isSourceLoading: false,
			isDestinationLoading: false,
			sourceError: null,
			destinationError: null,

			sourceOffset: 0,
			destinationOffset: 0,
			sourceSearchValue: '',
			destinationSearchValue: '',

			setSourceTokens: tokens => set({ sourceTokens: tokens }),
			setDestinationTokens: tokens => set({ destinationTokens: tokens }),

			selectSourceToken: token => set({ selectedSourceToken: token }),
			selectDestinationToken: token => set({ selectedDestinationToken: token }),

			clearSourceToken: () => set({ selectedSourceToken: null }),
			clearDestinationToken: () => set({ selectedDestinationToken: null }),

			setSourceLoading: isLoading => set({ isSourceLoading: isLoading }),
			setDestinationLoading: isLoading => set({ isDestinationLoading: isLoading }),

			setSourceError: error => set({ sourceError: error }),
			setDestinationError: error => set({ destinationError: error }),

			setSourceOffset: offset => set({ sourceOffset: offset }),
			setDestinationOffset: offset => set({ destinationOffset: offset }),

			setSourceSearchValue: searchValue => set({ sourceSearchValue: searchValue }),
			setDestinationSearchValue: searchValue => set({ destinationSearchValue: searchValue }),

			clearSourceTokens: () => set({ sourceTokens: [] }),
			clearDestinationTokens: () => set({ destinationTokens: [] }),
		}),
		Object.is,
	)

// HAVE SRC CHAIN TOKENS
// HAVE DEST CHAIN TOKENS\

// ABLE TO SELECT SRC TOKEN
// ABLE TO SELECT DEST TOKEN

// HAVE DEFAULT SELECTED SRC TOKEN
// HAVE DEFAULT SELECTED DEST TOKEN
