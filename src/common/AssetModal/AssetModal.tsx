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
	const {
		tokens,
		searchedTokens,
		isLoading,
		offset,
		setOffset,
		allTokens,
		allSearchedTokens,
		allTokensLoading,
		allOffset,
		setAllOffset,
	} = useTokensStore()
	useLoadTokens(selectedChain?.id)

	const displayTokens = useMemo(() => (selectedChain ? tokens : allTokens), [selectedChain, tokens, allTokens])

	const displaySearchedTokens = useMemo(
		() => (selectedChain ? searchedTokens : allSearchedTokens),
		[selectedChain, searchedTokens, allSearchedTokens],
	)

	const loading = useMemo(
		() => (selectedChain ? isLoading : allTokensLoading),
		[selectedChain, isLoading, allTokensLoading],
	)

	const currentOffset = useMemo(() => (selectedChain ? offset : allOffset), [selectedChain, offset, allOffset])

	const updateOffset = useCallback(
		(newOffset: number) => {
			if (selectedChain) {
				setOffset(newOffset)
			} else {
				setAllOffset(newOffset)
			}
		},
		[selectedChain, setOffset, setAllOffset],
	)

	const loadMoreTokens = useCallback(() => {
		updateOffset(currentOffset + 15)
	}, [currentOffset, updateOffset])

	const { ref } = useInfiniteScroll({
		disabled: isActive,
		onLoadMore: loadMoreTokens,
	})

	return (
		<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose}>
			<TokenSearch
				chain={selectedChain}
				setSearchValue={updateSearch}
				onSearchActive={setActive}
				onSearchResults={setResults}
				tokens={displaySearchedTokens}
			/>

			{!hasResults && isActive && !loading && <TokenNotFound />}

			<div className={classNames['scroll-content']} ref={ref}>
				{!isActive && <ChainMenu activeChain={selectedChain} onChainClick={onChainSelect} />}

				<TokenMenu
					isSearchActive={isActive}
					searchedTokens={displaySearchedTokens}
					chain={selectedChain}
					tokens={displayTokens}
					isLoading={loading}
					onTokenSelect={onSelect}
				/>
			</div>

			<div className={classNames['modal-blur']} />
		</Modal>
	)
}
