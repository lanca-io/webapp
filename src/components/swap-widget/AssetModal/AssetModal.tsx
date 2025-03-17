import type { AssetModalProps } from './types'
import { type FC, useState } from 'react'
import { Modal } from './Modal/Modal'
import { ChainMenu } from './ChainMenu/ChainMenu'
import { SearchBar } from './SearchBar/SearchBar'
import { TokenMenu } from './TokenMenu/TokenMenu'
import { TokenNotFound } from './TokenNotFound/TokenNotFound'

import classNames from './AssetModal.module.pcss'

export const AssetsModal: FC<AssetModalProps> = ({ isOpen, onClose, direction }) => {
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [hasSearchResults, setHasSearchResults] = useState<boolean>(true)

	const handleSearchActive = (isActive: boolean) => {
		setIsSearchActive(isActive)
	}

	const handleSearchResults = (hasResults: boolean) => {
		setHasSearchResults(hasResults)
	}

	return (
		<Modal title="Select a token and chain" isOpen={isOpen} onClose={onClose}>
			<SearchBar
				direction={direction}
				onSearchActive={handleSearchActive}
				onSearchResults={handleSearchResults}
			/>
			{!hasSearchResults && <TokenNotFound />}
			<div className={classNames['scroll-content']}>
				{!isSearchActive && hasSearchResults && <ChainMenu direction={direction} />}
				<TokenMenu direction={direction} />
			</div>
			<div className={classNames['modal-blur']} />
		</Modal>
	)
}
