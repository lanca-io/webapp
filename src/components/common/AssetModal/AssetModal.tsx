import { memo, useCallback, useMemo } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../../store/tokens/types'
import { Modal } from '../Modal/Modal'
import { ChainMenu } from '../ChainMenu/ChainMenu'
import { TokenSearch } from '../TokenSearch/TokenSearch'
import { TokenMenu } from '../TokenMenu/TokenMenu'
import { TokenNotFound } from '../TokenNotFound/TokenNotFound'
import { useAssetSearch } from '../../../hooks/useAssetSearch'
import { useTokenSelection } from '../../../hooks/useTokenSelection'
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll'
import './AssetModal.pcss'

interface ModalProps {
	isOpen: boolean
	onClose: () => void
	onSelect: (token: ExtendedToken) => void
	onChainSelect: (chain: ILancaChain) => void
	selectedChain: ILancaChain | null
}

export const AssetsModal = memo(
	({ isOpen, onClose, onSelect, onChainSelect, selectedChain }: ModalProps): JSX.Element => {
		const { isActive, hasResults, setActive, setResults, updateSearch } = useAssetSearch(selectedChain)
		const { tokens, searchTokens, isLoading, offset, setOffset } = useTokenSelection(selectedChain)

		const loadMore = useCallback(() => {
			setOffset(offset + 15)
		}, [offset, setOffset])

		const config = useMemo(
			() => ({
				disabled: isActive,
				onLoadMore: loadMore,
			}),
			[isActive, loadMore],
		)

		const { ref } = useInfiniteScroll(config)

		const search = useMemo(
			() => (
				<TokenSearch
					chain={selectedChain}
					setSearchValue={updateSearch}
					onSearchActive={setActive}
					onSearchResults={setResults}
					tokens={searchTokens}
				/>
			),
			[selectedChain, updateSearch, setActive, setResults, searchTokens],
		)

		const notFound = useMemo(
			() => (!hasResults && isActive && !isLoading ? <TokenNotFound /> : null),
			[hasResults, isActive, isLoading],
		)

		const chains = useMemo(
			() => (!isActive ? <ChainMenu activeChain={selectedChain} onChainClick={onChainSelect} /> : null),
			[isActive, selectedChain, onChainSelect],
		)

		const menu = useMemo(
			() => (
				<TokenMenu
					isSearchActive={isActive}
					searchedTokens={searchTokens}
					chain={selectedChain}
					tokens={tokens}
					isLoading={isLoading}
					onTokenSelect={onSelect}
				/>
			),
			[isActive, searchTokens, selectedChain, tokens, isLoading, onSelect],
		)

		return (
			<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose} onBackdropClick={onClose}>
				{search}
				{notFound}
				<div className="scroll_content" ref={ref}>
					{chains}
					{menu}
				</div>
				<div className="modal_blur" />
			</Modal>
		)
	},
)
