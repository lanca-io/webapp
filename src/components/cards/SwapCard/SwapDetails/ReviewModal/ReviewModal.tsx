import { useMemo } from 'react'
import { Modal } from '../../../../modals/Modal/Modal'
import { FeeDropdown } from '../FeeDropdown/FeeDropdown'
import { RouteInfo } from '../RouteInfo/RouteInfo'
import { SwapAmount } from '../SwapAmount/SwapAmount'
import { Separator } from '../../../../layout/Separator/Separator'
import { RouteStep } from '../RouteStep/RouteStep'
import { type RouteType } from 'lanca-sdk-demo'
import classNames from './ReviewModal.module.pcss'

interface ReviewModalProps {
	isOpen: boolean
	setIsOpen: (param: boolean) => void
	selectedRoute: RouteType
	amountUsd: number
}

export function ReviewModal({ isOpen, setIsOpen, selectedRoute }: ReviewModalProps) {
	const steps = useMemo(() => selectedRoute.steps, [selectedRoute.steps])

	return (
		<Modal position="top" show={isOpen} setShow={setIsOpen} title={'Review'} className={classNames.modal}>
			<div className="gap-md">
				<SwapAmount directionSide="from" direction={selectedRoute.from} />
				<SwapAmount directionSide="to" direction={selectedRoute.to} />
			</div>
			<Separator />
			{steps?.map((step, index) => <RouteStep key={index} step={step} />)}
			<RouteInfo route={selectedRoute} />
			<Separator />
			<FeeDropdown route={selectedRoute} />
		</Modal>
	)
}
