import type { FC } from 'react'
import type { AssetModalProps } from './types'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../store/tokens/types'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Modal } from '../Modal/Modal'
import { ChainMenu } from '../ChainMenu/ChainMenu'
import { TokenSearch } from '../TokenSearch/TokenSearch'
import { TokenMenu } from '../TokenMenu/TokenMenu'
import { TokenNotFound } from '../TokenNotFound/TokenNotFound'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useLoadTokens } from '../../hooks/Loadables/useLoadTokens'

import classNames from './AssetModal.module.pcss'

export const AssetsModal: FC<AssetModalProps> = ({ isOpen, onClose, direction }) => {
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [hasSearchResults, setHasSearchResults] = useState<boolean>(true)
	const [selectedChain, setSelectedChain] = useState<ILancaChain | null>(null)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const { chains } = useChainsStore()
	const { setSourceChain, setDestinationChain, setSourceToken, setDestinationToken } = useFormStore()

	useLoadTokens(selectedChain?.id)

	const {
		// For specific chain tokens
		tokens,
		searchedTokens,
		isLoading,
		offset,
		setOffset,
		setSearchValue,

		// For all chains tokens
		allTokens,
		allSearchedTokens,
		allTokensLoading,
		allOffset,
		setAllOffset,
		setAllSearchValue,
	} = useTokensStore()

	// Determine which data to use based on whether a chain is selected
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

	const updateSearchValue = useCallback(
		(value: string) => {
			if (selectedChain) {
				setSearchValue(value)
			} else {
				setAllSearchValue(value)
			}
		},
		[selectedChain, setSearchValue, setAllSearchValue],
	)

	// Set the appropriate chain and token in the form
	const setFormChainAndToken = useCallback(
		(chain: ILancaChain, token: ExtendedToken) => {
			if (direction === 'from') {
				setSourceChain(chain)
				setSourceToken(token)
			} else {
				setDestinationChain(chain)
				setDestinationToken(token)
			}
		},
		[direction, setSourceChain, setSourceToken, setDestinationChain, setDestinationToken],
	)

	const handleSearchActive = useCallback((isActive: boolean) => {
		setIsSearchActive(isActive)
	}, [])

	const handleSearchResults = useCallback((hasResults: boolean) => {
		setHasSearchResults(hasResults)
	}, [])

	const handleChainSelect = useCallback((chain: ILancaChain) => {
		setSelectedChain(chain)
	}, [])

	const handleTokenSelect = useCallback(
		(token: ExtendedToken) => {
			const chainId = token.chain_id
			const chain = chains.find(chain => chain.id === chainId)
			if (!chain) return

			setFormChainAndToken(chain, token)
			onClose()
		},
		[chains, setFormChainAndToken, onClose],
	)

	const handleScroll = useCallback(
		(e: Event) => {
			if (isSearchActive) return
			const target = e.target as HTMLDivElement
			const { scrollTop, scrollHeight, clientHeight } = target
			const heightToBottom = clientHeight - (scrollHeight - scrollTop)
			if (heightToBottom < 1 && heightToBottom > -1) {
				updateOffset(currentOffset + 15)
			}
		},
		[isSearchActive, currentOffset, updateOffset],
	)

	useEffect(() => {
		if (scrollContainerRef.current) {
			const container = scrollContainerRef.current
			container.addEventListener('scroll', handleScroll)
			return () => container.removeEventListener('scroll', handleScroll)
		}
	}, [handleScroll])

	// Reset selected chain when modal opens
	useEffect(() => {
		if (isOpen) {
			setSelectedChain(null)
		}
	}, [isOpen])

	return (
		<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose}>
			<TokenSearch
				chain={selectedChain}
				setSearchValue={updateSearchValue}
				onSearchActive={handleSearchActive}
				onSearchResults={handleSearchResults}
				tokens={displaySearchedTokens}
			/>
			{!hasSearchResults && isSearchActive && !loading && <TokenNotFound />}
			<div className={classNames['scroll-content']} ref={scrollContainerRef}>
				{!isSearchActive && (
					<ChainMenu chains={chains} activeChain={selectedChain} onChainClick={handleChainSelect} />
				)}
				<TokenMenu
					isSearchActive={isSearchActive}
					searchedTokens={displaySearchedTokens}
					chain={selectedChain}
					tokens={displayTokens}
					isLoading={loading}
					onTokenSelect={handleTokenSelect}
				/>
			</div>
			<div className={classNames['modal-blur']} />
		</Modal>
	)
}
