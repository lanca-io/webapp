import { useEffect, useState, useCallback, useMemo } from 'react'
import classNames from './RouteInfo.module.pcss'
import { GasIcon } from '../../../../../assets/icons/GasIcon'
import { TimeIcon } from '../../../../../assets/icons/TimeIcon'
import { useContractGas } from '../../../../../hooks/useContractGas/useContractGas'
import { type RouteType } from 'lanca-sdk-demo'
import { useAccount } from 'wagmi'
import { Loader } from '../../../../layout/Loader/Loader'

interface RouteInfoProps {
	route: RouteType
}

export function RouteInfo({ route }: RouteInfoProps) {
	const { address } = useAccount()
	const [gas, setGas] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	const handleSetGas = useCallback(async () => {
		setLoading(true)
		const gasPrice = await useContractGas(route, address!)
		setLoading(false)
		setGas(gasPrice)
	}, [route, address])

	useEffect(() => {
		void handleSetGas()
	}, [handleSetGas])

	const gasDisplay = useMemo(() => {
		if (loading) {
			return <Loader variant="neutral" />
		}
		return <p className={`body2 ${classNames.value}`}>{gas ? `$${gas}` : 'n/a'}</p>
	}, [loading, gas])

	return (
		<div className={classNames.container}>
			<div className={classNames.tagContainer}>
				<div className="gap-sm row">
					<GasIcon />
					<p className="body2">Gas to pay</p>
				</div>
				{gasDisplay}
			</div>

			<div className={classNames.tagContainer}>
				<div className="gap-sm row">
					<TimeIcon />
					<p className="body2">ETA</p>
				</div>
				<p className={`body2 ${classNames.valueBlue}`}>30 sec.</p>
			</div>
		</div>
	)
}
