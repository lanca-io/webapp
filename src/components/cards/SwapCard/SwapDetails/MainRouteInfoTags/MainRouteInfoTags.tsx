import classNames from './MainRouteInfoTags.module.pcss'
import { GasIcon } from '../../../../../assets/icons/GasIcon'
import { TimeIcon } from '../../../../../assets/icons/TimeIcon'
import { useEffect, useState } from 'react'
import { getContractGas } from '../../txFunctions/getContractGas'
import { type RouteData } from '../../../../../sdk/types/routeTypes'
import { useAccount } from 'wagmi'
import { Loader } from '../../../../layout/Loader/Loader'

interface MainRouteInfoTagsProps {
	route: RouteData
}

export function MainRouteInfoTags({ route }: MainRouteInfoTagsProps) {
	const { address } = useAccount()
	const [gas, setGas] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSetGas = async () => {
		setLoading(true)
		const gasPrice = await getContractGas(route, address!)
		setLoading(false)

		setGas(gasPrice)
	}

	useEffect(() => {
		void handleSetGas()
	}, [route.from.chain.id])

	return (
		<div className={classNames.container}>
			<div className={classNames.tagContainer}>
				<div className="gap-sm row">
					<GasIcon />
					<p className="body2">Gas to pay:</p>
				</div>
				{loading ? (
					<Loader variant="neutral" />
				) : (
					<p className={`body2 ${classNames.value}`}>{gas ? `$${gas}` : 'n/a'}</p>
				)}
			</div>

			<div className={classNames.tagContainer}>
				<div className="gap-sm row">
					<TimeIcon />
					<p className="body2">ETA:</p>
				</div>
				<p className={`body2 ${classNames.valueBlue}`}>30 sec</p>
			</div>
		</div>
	)
}
