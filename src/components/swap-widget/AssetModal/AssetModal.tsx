import type { AssetModalProps } from './types'
import { type FC, useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Modal } from './Modal/Modal'
import { ChainMenu } from './ChainMenu/ChainMenu'
import { SearchBar } from './SearchBar/SearchBar'
import { TokenMenu } from './TokenMenu/TokenMenu'
import { TokenNotFound } from './TokenNotFound/TokenNotFound'
import { useTokensStore } from '../../../store/tokens/useTokensStore'
import { useFormStore } from '../../../store/form/useFormStore'
import { useChainsStore } from '../../../store/chains/useChainsStore'
import type { ILancaChain } from '@lanca/sdk'

import classNames from './AssetModal.module.pcss'

export const AssetsModal: FC<AssetModalProps> = ({ isOpen, onClose, direction }) => {
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [hasSearchResults, setHasSearchResults] = useState<boolean>(true)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const { chains } = useChainsStore()
	const { srcChain, dstChain, setSrcChain, setDstChain } = useFormStore()
	const {
		srcTokens,
		srcOffset,
		srcSearchedTokens,
		srcTokensLoading,
		setSrcOffset,
		setSrcSearchValue,

		dstTokens,
		dstOffset,
		dstSearchedTokens,
		dstTokensLoading,
		setDstOffset,
		setDstSearchValue,

		allTokens,
		allOffset,
		allSearchedTokens,
		allTokensLoading,
		setAllOffset,
		setAllSearchValue,
	} = useTokensStore()

	const chain = useMemo(() => (direction === 'from' ? srcChain : dstChain), [direction, srcChain, dstChain])

	const loading = useMemo(
		() =>
			direction === 'from'
				? srcChain
					? srcTokensLoading
					: allTokensLoading
				: dstChain
					? dstTokensLoading
					: allTokensLoading,
		[direction, srcChain, dstChain, srcTokensLoading, dstTokensLoading, allTokensLoading],
	)

	const tokens = useMemo(
		() => (direction === 'from' ? (srcChain ? srcTokens : allTokens) : dstChain ? dstTokens : allTokens),
		[direction, srcChain, dstChain, srcTokens, dstTokens, allTokens],
	)

	const offset = useMemo(
		() => (direction === 'from' ? (srcChain ? srcOffset : allOffset) : dstChain ? dstOffset : allOffset),
		[direction, srcChain, dstChain, srcOffset, dstOffset, allOffset],
	)

	const setOffset = useMemo(
		() =>
			direction === 'from' ? (srcChain ? setSrcOffset : setAllOffset) : dstChain ? setDstOffset : setAllOffset,
		[direction, srcChain, dstChain, setSrcOffset, setDstOffset, setAllOffset],
	)
	const searchedTokens = useMemo(
		() =>
			direction === 'from'
				? srcChain
					? srcSearchedTokens
					: allSearchedTokens
				: dstChain
					? dstSearchedTokens
					: allSearchedTokens,
		[direction, srcChain, dstChain, srcSearchedTokens, dstSearchedTokens, allSearchedTokens],
	)

	const setSearchValue = useMemo(
		() =>
			direction === 'from'
				? srcChain
					? setSrcSearchValue
					: setAllSearchValue
				: dstChain
					? setDstSearchValue
					: setAllSearchValue,
		[direction, srcChain, dstChain, setSrcSearchValue, setDstSearchValue, setAllSearchValue],
	)

	const selectChain = useMemo(
		() => (direction === 'from' ? setSrcChain : setDstChain),
		[direction, srcChain, dstChain],
	)

	const handleSearchActive = useCallback((isActive: boolean) => {
		setIsSearchActive(isActive)
	}, [])

	const handleSearchResults = useCallback((hasResults: boolean) => {
		setHasSearchResults(hasResults)
	}, [])

	const handleChainSelect = useCallback(
		(chain: ILancaChain) => {
			selectChain(chain)
		},
		[selectChain],
	)

	const handleScroll = useCallback(
		(e: Event) => {
			const target = e.target as HTMLDivElement
			const { scrollTop, scrollHeight, clientHeight } = target
			const heightToBottom = clientHeight - (scrollHeight - scrollTop)
			if (heightToBottom < 1 && heightToBottom > -1) {
				setOffset(offset + 15)
			}
		},
		[offset, setOffset],
	)

	useEffect(() => {
		const container = scrollContainerRef.current
		if (container) {
			container.addEventListener('scroll', handleScroll)
			return () => container.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	return (
		<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose}>
			<SearchBar
				chain={chain}
				setSearchValue={setSearchValue}
				onSearchActive={handleSearchActive}
				onSearchResults={handleSearchResults}
				tokens={searchedTokens}
			/>
			{!hasSearchResults && isSearchActive && !loading && <TokenNotFound />}
			<div className={classNames['scroll-content']} ref={scrollContainerRef}>
				{!isSearchActive && <ChainMenu chains={chains} activeChain={chain} onChainClick={handleChainSelect} />}
				<TokenMenu
					isSearchActive={isSearchActive}
					searchedTokens={searchedTokens}
					chain={chain}
					tokens={tokens}
					isLoading={loading}
				/>
			</div>
			<div className={classNames['modal-blur']} />
		</Modal>
	)
}
