import type { FC } from 'react'
import type { AssetSelectionProps } from './types'
import { memo } from 'react'
import { useFormStore } from '../../../store/form/useFormStore'
import { TrailArrowRightIcon } from '../../../assets/icons/TrailArrowRightIcon'

import classNames from './AssetSelection.module.pcss'

const TokenDisplay: FC<{ logoURI?: string; symbol?: string }> = ({ logoURI, symbol }) => (
	<div className={classNames['asset-selection__token']}>
		<img src={logoURI} alt={symbol} className={classNames['asset-selection__token-logo']} />
		<p className={classNames['asset-selection__token-name']}>{symbol}</p>
	</div>
)

const ChainDisplay: FC<{ logoURI?: string; name?: string }> = ({ logoURI, name }) => (
	<div className={classNames['asset-selection__chain']}>
		<img src={logoURI} alt={name} className={classNames['asset-selection__chain-logo']} />
		<p className={classNames['asset-selection__chain-name']}>{name}</p>
	</div>
)

const Pointer: FC = () => (
	<div className={classNames['asset-selection__arrow']}>
		<TrailArrowRightIcon />
	</div>
)

export const AssetSelection: FC<AssetSelectionProps> = memo(({ direction, openModal }) => {
	const { srcToken, dstToken, srcChain, dstChain } = useFormStore()

	const token = direction === 'from' ? srcToken : dstToken
	const chain = direction === 'from' ? srcChain : dstChain

	const handleClick = () => {
		openModal()
	}

	return (
		<div className={classNames['asset-selection']} onClick={handleClick}>
			<TokenDisplay logoURI={token?.logoURI} symbol={token?.symbol} />
			<p className={classNames['asset-selection__pointer']}>on</p>
			<ChainDisplay logoURI={chain?.logoURI} name={chain?.name} />
			<Pointer />
		</div>
	)
})
