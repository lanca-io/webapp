import classNames from './ChainsPicker.module.pcss'
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../../../hooks/DataContext/DataContext'
import { Button } from '../../../layout/buttons/Button/Button'
import type { Chain } from '../../../../api/concero/types'
import { useTranslation } from 'react-i18next'
import { CardModal } from '../../CardModal/CardModal'
import { ChainListItem } from './ChainListItem/ChainListItem'
import { TextInput } from '../../../layout/input/TextInput'
import { IconSearch } from '@tabler/icons-react'

interface TokensModalHeaderProps {
	selectedChain: Chain | null
	setSelectedChain: (param: Chain | null) => void
}

export function ChainsPicker({ selectedChain, setSelectedChain }: TokensModalHeaderProps) {
	const { getChains, chains } = useContext(DataContext)
	const [searchValue, setSearchValue] = useState<string>('')
	const [isChainsModalOpen, setIsChainsModalOpen] = useState<boolean>(false)
	const { t } = useTranslation()

	const fistLineChains = chains.slice(0, 7)

	const handleOpenChainsModal = (isOpen: boolean) => {
		setIsChainsModalOpen(isOpen)
		setSearchValue('')
	}

	const handleSelectChain = (chain: Chain) => {
		handleOpenChainsModal(false)
		setSelectedChain(chain)
	}

	useEffect(() => {
		if (chains.length !== 0) return

		getChains({ offset: 0, limit: 18 })
	}, [])

	return (
		<div className={classNames.container}>
			<h5 className={classNames.title}>{t('tokensModal.chains')}</h5>

			<div className={classNames.firsChainsLineContainer}>
				{fistLineChains.map((chain: Chain, index) => {
					const isSelected = selectedChain?.id === chain.id
					return (
						<ChainListItem
							key={index.toString()}
							chain={chain}
							isSelected={isSelected}
							onSelect={setSelectedChain}
						/>
					)
				})}
				{chains.length - 7 > 0 ? (
					<Button
						variant={'subtle'}
						size={'md'}
						className={classNames.moreButton}
						onClick={() => {
							setIsChainsModalOpen(true)
						}}
					>
						+{chains.length - 7}
					</Button>
				) : null}
			</div>

			<CardModal isOpen={isChainsModalOpen} setIsOpen={handleOpenChainsModal} title={t('tokensModal.chains')}>
				<TextInput
					value={searchValue}
					onChangeText={(value: string) => {
						setSearchValue(value)
					}}
					placeholder={t('tokensModal.search')}
					icon={<IconSearch size={18} color={'var(--color-text-secondary'} />}
				/>
				<div className={classNames.chainsContainer}>
					{chains.map((chain: Chain, index) => {
						const isSelected = selectedChain?.id === chain.id
						return (
							<ChainListItem
								key={index.toString()}
								chain={chain}
								isSelected={isSelected}
								onSelect={handleSelectChain}
								isCropped={false}
							/>
						)
					})}
				</div>
			</CardModal>
		</div>
	)
}
