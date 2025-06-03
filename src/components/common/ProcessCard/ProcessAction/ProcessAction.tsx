import type { FC } from 'react'
import { memo, useCallback } from 'react'
import { useTxExecutionStore } from '../../../../store/tx-execution/useTxExecutionStore'
import { useTxProcess } from '../../../../hooks/useTxProcess'
import { Button } from '@concero/ui-kit'
import { Status } from '@lanca/sdk'
import { useFormStore } from '../../../../store/form/useFormStore'
import { arbitrum, base, polygon, avalanche, optimism } from 'viem/chains'
import './ProcessAction.pcss'

const chainsTwitterMap: Record<string, string> = {
	[arbitrum.id]: 'arbitrum',
	[base.id]: 'base',
	[polygon.id]: '0xPolygon',
	[avalanche.id]: 'avax',
	[optimism.id]: 'Optimism',
}

export const ProcessAction: FC = memo((): JSX.Element | null => {
	const { reset, executionTime } = useTxExecutionStore()
	const { fromChain, toChain, clearInputs } = useFormStore()
	const { txStatus } = useTxProcess()

	const handleReset = useCallback(() => {
		reset()
		clearInputs()
	}, [reset, clearInputs])

	const handleShareOnX = useCallback(() => {
		const time = executionTime ? executionTime : '10.00'

		const fromChainHandle = fromChain?.id ? chainsTwitterMap[Number(fromChain.id)] || fromChain.name : 'ethereum'
		const toChainHandle = toChain?.id ? chainsTwitterMap[Number(toChain.id)] || toChain.name : 'ethereum'
		const shareUrl = `https://x.com/intent/tweet?text=Just%20performed%20a%20fully%20decentralised%20swap%20from%20%40${fromChainHandle}%20to%20%40${toChainHandle}%20in%20just%20${time}%20sec%20on%20%40lanca_io!%0A%0ASecured%20by%20%40chainlink%20CCIP%0A%0ATry%20to%20break%20my%20record%20on%20lanca.io%20👇`

		window.open(shareUrl, '_blank', 'noopener,noreferrer')
	}, [executionTime, fromChain, toChain])

	if (txStatus === Status.FAILED || txStatus === Status.REJECTED) {
		return (
			<div className={`process_action_${txStatus.toLowerCase()}`}>
				<div className="process_action">
					<Button
						variant="secondary_color"
						size="l"
						isFull
						onClick={handleReset}
						data-testid="try-again-button"
					>
						Try again
					</Button>
				</div>
			</div>
		)
	}

	if (txStatus === Status.SUCCESS) {
		return (
			<div className={`process_action_${txStatus.toLowerCase()}`}>
				<div className="process_action">
					<Button
						variant="secondary_color"
						size="l"
						isFull
						onClick={handleReset}
						data-testid="swap-again-button"
					>
						Swap again
					</Button>
					<Button variant="secondary" size="l" isFull onClick={handleShareOnX} data-testid="share-x-button">
						Share on X
					</Button>
				</div>
			</div>
		)
	}

	return null
})
