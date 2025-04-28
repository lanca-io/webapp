import type { FC } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../store/tokens/types'
import { useCallback, memo } from 'react'
import { Modal } from '../Modal/Modal'
import { ChainMenu } from '../ChainMenu/ChainMenu'
import { TokenSearch } from '../TokenSearch/TokenSearch'
import { TokenMenu } from '../TokenMenu/TokenMenu'
import { TokenNotFound } from '../TokenNotFound/TokenNotFound'
import { useAssetSearch } from '../../hooks/useAssetSearch'
import { useTokenSelection } from '../../hooks/useTokenSelection'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import './AssetModal.pcss'

type AssetModalProps = {
	isOpen: boolean
	onClose: () => void
	onSelect: (token: ExtendedToken) => void
	onChainSelect: (chain: ILancaChain) => void
	selectedChain: ILancaChain | null
}

export const AssetsModal: FC<AssetModalProps> = memo(({ isOpen, onClose, onSelect, onChainSelect, selectedChain }) => {
	const { isActive, hasResults, setActive, setResults, updateSearch } = useAssetSearch(selectedChain)
	const { tokens, searchTokens, isLoading, offset, setOffset } = useTokenSelection(selectedChain)

	const loadMore = useCallback(() => {
		setOffset(offset + 15)
	}, [offset, setOffset])

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

			<div className="scroll_content" ref={ref}>
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

			<div className="modal_blur" />
		</Modal>
	)
})
