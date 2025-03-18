import type { FC } from 'react'
import type { AssetModalProps } from './types'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../../store/tokens/types'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Modal } from './Modal/Modal'
import { ChainMenu } from './ChainMenu/ChainMenu'
import { SearchBar } from './SearchBar/SearchBar'
import { TokenMenu } from './TokenMenu/TokenMenu'
import { TokenNotFound } from './TokenNotFound/TokenNotFound'
import { useTokensStore } from '../../../store/tokens/useTokensStore'
import { useChainsStore } from '../../../store/chains/useChainsStore'
import { useFormStore } from '../../../store/form/useFormStore'

import classNames from './AssetModal.module.pcss'

export const AssetsModal: FC<AssetModalProps> = ({ isOpen, onClose, direction }) => {
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [hasSearchResults, setHasSearchResults] = useState<boolean>(true)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const { chains, selectedSrcChain, selectedDstChain, setSelectedSrcChain, setSelectedDstChain } = useChainsStore()
	const { setSrcChain, setDstChain, setSrcToken, setDstToken } = useFormStore()

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

	const chain = useMemo(
		() => (direction === 'from' ? selectedSrcChain : selectedDstChain),
		[direction, selectedSrcChain, selectedDstChain],
	)

	const loading = useMemo(
		() =>
			direction === 'from'
				? selectedSrcChain
					? srcTokensLoading
					: allTokensLoading
				: selectedDstChain
					? dstTokensLoading
					: allTokensLoading,
		[direction, selectedSrcChain, selectedDstChain, srcTokensLoading, dstTokensLoading, allTokensLoading],
	)

	const tokens = useMemo(
		() =>
			direction === 'from'
				? selectedSrcChain
					? srcTokens
					: allTokens
				: selectedDstChain
					? dstTokens
					: allTokens,
		[direction, selectedSrcChain, selectedDstChain, srcTokens, dstTokens, allTokens],
	)

	const offset = useMemo(
		() =>
			direction === 'from'
				? selectedSrcChain
					? srcOffset
					: allOffset
				: selectedDstChain
					? dstOffset
					: allOffset,
		[direction, selectedSrcChain, selectedDstChain, srcOffset, dstOffset, allOffset],
	)

	const setOffset = useMemo(
		() =>
			direction === 'from'
				? selectedSrcChain
					? setSrcOffset
					: setAllOffset
				: selectedDstChain
					? setDstOffset
					: setAllOffset,
		[direction, selectedSrcChain, selectedDstChain, setSrcOffset, setDstOffset, setAllOffset],
	)

	const searchedTokens = useMemo(
		() =>
			direction === 'from'
				? selectedSrcChain
					? srcSearchedTokens
					: allSearchedTokens
				: selectedDstChain
					? dstSearchedTokens
					: allSearchedTokens,
		[direction, selectedSrcChain, selectedDstChain, srcSearchedTokens, dstSearchedTokens, allSearchedTokens],
	)

	const setSearchValue = useMemo(
		() =>
			direction === 'from'
				? selectedSrcChain
					? setSrcSearchValue
					: setAllSearchValue
				: selectedDstChain
					? setDstSearchValue
					: setAllSearchValue,
		[direction, selectedSrcChain, selectedDstChain, setSrcSearchValue, setDstSearchValue, setAllSearchValue],
	)

	const setChain = useMemo(
		() => (direction === 'from' ? setSrcChain : setDstChain),
		[direction, setSrcChain, setDstChain],
	)

	const setToken = useMemo(
		() => (direction === 'from' ? setSrcToken : setDstToken),
		[direction, setSrcToken, setDstToken],
	)

	const selectChain = useMemo(
		() => (direction === 'from' ? setSelectedSrcChain : setSelectedDstChain),
		[direction, setSelectedSrcChain, setSelectedDstChain],
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

	const handleTokenSelect = useCallback(
		(token: ExtendedToken) => {
			const chainId = token.chain_id
			const chain = chains.find(chain => chain.id === chainId)
			if (!chain) return
			setChain(chain)
			setToken(token)
			onClose()
		},
		[chain, setChain, setToken, onClose],
	)

	const handleScroll = useCallback(
		(e: Event) => {
			if (isSearchActive) return
			const target = e.target as HTMLDivElement
			const { scrollTop, scrollHeight, clientHeight } = target
			const heightToBottom = clientHeight - (scrollHeight - scrollTop)
			if (heightToBottom < 1 && heightToBottom > -1) {
				setOffset(offset + 15)
			}
		},
		[isSearchActive, offset, setOffset],
	)

	useEffect(() => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current
			container.addEventListener('scroll', handleScroll)
			return () => container.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll, scrollContainerRef.current])

	useEffect(() => {
		if (isOpen) {
			selectChain(null)
		}
	}, [isOpen, direction, setSelectedSrcChain, setSelectedDstChain])

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
					onTokenSelect={handleTokenSelect}
				/>
			</div>
			<div className={classNames['modal-blur']} />
		</Modal>
	)
}
