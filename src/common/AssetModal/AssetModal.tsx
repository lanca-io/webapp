import type { FC } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../store/tokens/types'
import { useMemo, useCallback } from 'react'
import { Modal } from '../Modal/Modal'
import { ChainMenu } from '../ChainMenu/ChainMenu'
import { TokenSearch } from '../TokenSearch/TokenSearch'
import { TokenMenu } from '../TokenMenu/TokenMenu'
import { TokenNotFound } from '../TokenNotFound/TokenNotFound'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useLoadTokens } from '../../hooks/Loadables/useLoadTokens'
import { useAssetSearch } from '../../hooks/useAssetSearch'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import classNames from './AssetModal.module.pcss'

export type AssetModalProps = {
	isOpen: boolean
	onClose: () => void
	onSelect: (token: ExtendedToken) => void
	onChainSelect: (chain: ILancaChain) => void
	selectedChain: ILancaChain | null
}

export const AssetsModal: FC<AssetModalProps> = ({ isOpen, onClose, onSelect, onChainSelect, selectedChain }) => {
	const { isActive, hasResults, setActive, setResults, updateSearch } = useAssetSearch(selectedChain)

	const store = useTokensStore()

	useLoadTokens(selectedChain?.id)

	const tokens = useMemo(
		() => (selectedChain ? store.tokens : store.allTokens),
		[selectedChain, store.tokens, store.allTokens],
	)

	const searchTokens = useMemo(
		() => (selectedChain ? store.searchedTokens : store.allSearchedTokens),
		[selectedChain, store.searchedTokens, store.allSearchedTokens],
	)

	const isLoading = useMemo(
		() => (selectedChain ? store.isLoading : store.allTokensLoading),
		[selectedChain, store.isLoading, store.allTokensLoading],
	)

	const offset = useMemo(
		() => (selectedChain ? store.offset : store.allOffset),
		[selectedChain, store.offset, store.allOffset],
	)

	const setNewOffset = useCallback(
		(newOffset: number) => {
			if (selectedChain) {
				store.setOffset(newOffset)
			} else {
				store.setAllOffset(newOffset)
			}
		},
		[selectedChain, store.setOffset, store.setAllOffset],
	)

	const loadMore = useCallback(() => setNewOffset(offset + 15), [offset, setNewOffset])

	const { ref } = useInfiniteScroll({
		disabled: isActive,
		onLoadMore: loadMore,
	})

	return (
		<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose}>
			<TokenSearch
				chain={selectedChain}
				setSearchValue={updateSearch}
				onSearchActive={setActive}
				onSearchResults={setResults}
				tokens={searchTokens}
			/>

			{!hasResults && isActive && !isLoading && <TokenNotFound />}

			<div className={classNames['scroll-content']} ref={ref}>
				{!isActive && <ChainMenu activeChain={selectedChain} onChainClick={onChainSelect} />}

				<TokenMenu
					isSearchActive={isActive}
					searchedTokens={searchTokens}
					chain={selectedChain}
					tokens={tokens}
					isLoading={isLoading}
					onTokenSelect={onSelect}
				/>
			</div>

			<div className={classNames['modal-blur']} />
		</Modal>
	)
}
