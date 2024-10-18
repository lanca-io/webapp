import type { Chain } from '../../../../../api/concero/types'
import classNames from './ChainListItem.module.pcss'
import { config } from '../../../../../constants/config'
import { testnetToMainnetChainsMap } from '../../../../../constants/testnetToMainnetChainsMap'

interface ChainItemProps {
	chain: Chain
	isSelected: boolean
	onSelect: (param: Chain) => void
	isTestnet: boolean
}

function ChainIcon({ src }: { src: string }) {
	return (
		<div className={classNames.chainIcon}>
			<img src={src} />
		</div>
	)
}

export function ChainListItem({ chain, isSelected, onSelect, isTestnet }: ChainItemProps) {
	return (
		<div
			className={`${classNames.container} ${isSelected ? classNames.selected : null}`}
			onClick={() => {
				onSelect(chain)
			}}
		>
			<div className={`${classNames.chainButton}`}>
				<ChainIcon
					src={`${config.CONCERO_ASSETS_URI}/icons/chains/filled/${isTestnet ? testnetToMainnetChainsMap[chain.id] : chain.id}.svg`}
				/>
			</div>
			<p className="body2">{chain.name}</p>
		</div>
	)
}
