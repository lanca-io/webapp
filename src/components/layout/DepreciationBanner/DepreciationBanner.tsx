import type { FC } from 'react'
import { Lanca } from '../../../assets/icons/Lanca'
import classNames from './DepreciationBanner.module.pcss'

export const DepreciationBanner: FC = () => {
	return (
		<div className={classNames.depreciation_banner}>
			<div className={classNames.depreciation_banner_content}>
				<div className={classNames.depreciation_banner_icon}>
					<Lanca />
				</div>
				<div className={classNames.depreciation_banner_description}>
					<h5 className={classNames.depreciation_banner_title}>Lanca is entering a new chapter.</h5>
					<p className={classNames.depreciation_banner_subtitle}>
						We’re sunsetting the current pools and pausing swaps and bridges. If you provided liquidity,
						please withdraw it — pool support will end soon.
					</p>
				</div>
			</div>
		</div>
	)
}
