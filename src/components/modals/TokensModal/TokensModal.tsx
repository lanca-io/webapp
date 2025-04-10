import { type ChangeEvent, type UIEvent, useContext, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from './TokensModal.module.pcss'
import { TextInput } from '../../layout/input/TextInput'
import type { Chain, Token } from '../../../api/concero/types'
import { DataContext } from '../../../hooks/DataContext/DataContext'
import { useAccount } from 'wagmi'
import { TokenListItem } from './TokenListItem/TokenListItem'
import { TokenSkeletonLoader } from './TokenSkeletonLoader/TokenSkeletonLoader'
import { useTokensModalReducer } from './useTokensModalReducer/useTokensModalReducer'
import { TokenModalActionType } from './useTokensModalReducer/types'
import { getBalanceTokens } from './handlers/getBalanceTokens'
import { ChainsPicker } from './ChainsPicker/ChainsPicker'
import { Modal } from '../Modal/Modal'
import { SelectionContext } from '../../../hooks/SelectionContext'
import { WriteIcon } from '../../../assets/icons/WriteIcon'
import { type ILancaChain } from '@lanca/sdk'

interface TokensModalProps {
	isOpen: boolean
	onClose: () => void
	onSelect: (token: Token, chain: ILancaChain) => void
	direction: 'from' | 'to'
}

export function TokensModal({ isOpen, onClose, onSelect, direction }: TokensModalProps) {
	const { t } = useTranslation()
	const { address } = useAccount()
	const { getTokens, getChains } = useContext(DataContext)
	const tokenContainerRef = useRef<HTMLDivElement>(null)
	const limit = 15
	const { selection } = useContext(SelectionContext)
	const [tokensModalState, tokensModalDispatch] = useTokensModalReducer(selection.swapCard[direction].chain)
	const { selectedChain, tokens, isLoading, isBalanceLoading, offset, searchValue, balanceTokens } = tokensModalState

	const addTokens = async () => {
		const newTokens = await getTokens({ chainId: selectedChain?.id, offset, limit, search: searchValue })
		if (!newTokens.length) return
		tokensModalDispatch({ type: TokenModalActionType.UPSERT_TOKENS, tokens: newTokens })
	}

	const handleEndReached = async () => {
		if (!selectedChain) return
		const newOffset = offset + limit
		tokensModalDispatch({ type: TokenModalActionType.SET_OFFSET, offset: newOffset })
		void addTokens()
	}

	const handleScroll = (e: UIEvent<HTMLDivElement>) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
		const heightToBottom = clientHeight - (scrollHeight - scrollTop)
		if (heightToBottom < 1 && heightToBottom > -1) {
			void handleEndReached()
		}
	}

	async function initialPopulateTokens() {
		tokensModalDispatch({ type: TokenModalActionType.SET_OFFSET, offset: 0 })
		tokensModalDispatch({ type: TokenModalActionType.SET_TOKENS, tokens: [] })
		tokensModalDispatch({ type: TokenModalActionType.SET_IS_LOADING, isLoading: true })

		const resTokens = await getTokens({ chainId: selectedChain.id, offset: 0, limit, search: searchValue })

		if (resTokens.length > 0) {
			tokensModalDispatch({ type: TokenModalActionType.SET_TOKENS, tokens: resTokens })
			tokensModalDispatch({ type: TokenModalActionType.SET_OFFSET, offset: 15 })
		}

		tokensModalDispatch({ type: TokenModalActionType.SET_IS_LOADING, isLoading: false })

		void getBalanceTokens(tokensModalDispatch, address, selectedChain)
	}

	const moveToTop = () => {
		if (tokenContainerRef.current) {
			tokenContainerRef.current.scrollTop = 0
		}
	}

	const handleSelectChain = (chain: ILancaChain | null) => {
		tokensModalDispatch({ type: TokenModalActionType.SET_SELECTED_CHAIN, chain })
	}

	const handleSelect = async (token: Token) => {
		if (selectedChain) {
			onSelect(token, selectedChain)
			return
		}
		const chains = await getChains({ offset: 0, limit: 20 })
		const chain = chains.find((chain: Chain) => chain.id.toString() === token.chain_id.toString())
		onSelect(token, chain!)
	}

	const handleSearch = async (e: ChangeEvent<HTMLInputElement>) => {
		tokensModalDispatch({ type: TokenModalActionType.SET_SEARCH_VALUE, searchValue: e.target.value })
	}

	useEffect(() => {
		void initialPopulateTokens()
		moveToTop()
	}, [selectedChain?.id, address, searchValue])

	const selectedToken = selection.swapCard[direction].token

	return (
		<Modal
			position="top"
			show={isOpen}
			setShow={onClose}
			title={t('tokensModal.selectChainToken')}
			className={classNames.modal}
			isHeaderVisible
		>
			<div className={classNames.container}>
				<TextInput
					placeholder={t('tokensModal.searchByTokenNameOrAddress')}
					icon={<WriteIcon />}
					value={searchValue}
					onChange={handleSearch}
					variant="inline"
				/>

				<ChainsPicker selectedChain={selectedChain} setSelectedChain={handleSelectChain} />

				<div className="gap-sm">
					<h5 className={classNames.title}>Tokens</h5>

					<div className={classNames.tokenContainer} onScroll={handleScroll} ref={tokenContainerRef}>
						{!isLoading && tokens ? (
							tokens.map((token: Token, index: number) => {
								const isSelected =
									selectedToken.address === token.address &&
									String(selectedToken.chain_id) === String(selectedChain.id)

								return (
									<TokenListItem
										isSelected={isSelected}
										key={token.address.toLowerCase() + index.toString()}
										token={token}
										isBalanceLoading={isBalanceLoading}
										onSelect={handleSelect}
										explorerURI={selectedChain.explorerURI}
									/>
								)
							})
						) : (
							<TokenSkeletonLoader count={9} />
						)}
					</div>
				</div>
			</div>
		</Modal>
	)
}
