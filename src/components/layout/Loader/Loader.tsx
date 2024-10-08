import classNames from './Loader.module.pcss'
import { PrimaryLoaderIcon } from '../../../assets/icons/Loaders/PrimaryLoaderIcon'
import { NeutralLoaderIcon } from '../../../assets/icons/Loaders/NeutralLoaderIcon'

interface Props {
	variant?: 'primary' | 'neutral'
}

export function Loader({ variant = 'primary' }: Props) {
	return (
		<div className={classNames.loader}>{variant === 'primary' ? <PrimaryLoaderIcon /> : <NeutralLoaderIcon />}</div>
	)
}
