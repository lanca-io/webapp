import type { FC } from 'react'
import { memo, useCallback } from 'react'
import { useTxExecutionStore } from '../../../../store/tx-execution/useTxExecutionStore'
import { useTxProcess } from '../../../../hooks/useTxProcess'
import { Button } from '@concero/ui-kit'
import { Status } from '@lanca/sdk'
import { useFormStore } from '../../../../store/form/useFormStore'
import { arbitrum, base, polygon, avalanche } from 'viem/chains'
import './ProcessAction.pcss'

const chainsTwitterMap: Record<string, string> = {
	[arbitrum.id]: 'arbitrum',
	[base.id]: 'base',
	[polygon.id]: '0xPolygon',
	[avalanche.id]: 'avax',
}

export const ProcessAction: FC = memo((): JSX.Element | null => {
	const { reset, executionTime } = useTxExecutionStore()
	const { sourceChain, destinationChain, clearInput } = useFormStore()
	const { txStatus } = useTxProcess()

	const handleReset = useCallback(() => {
		reset()
		clearInput()
	}, [reset])

	const handleShareOnX = useCallback(() => {
		const time = executionTime ? executionTime : '10.00'

		const fromChainHandle = sourceChain?.id
			? chainsTwitterMap[Number(sourceChain.id)] || sourceChain.name
			: 'ethereum'

		const toChainHandle = destinationChain?.id
			? chainsTwitterMap[Number(destinationChain.id)] || destinationChain.name
			: 'ethereum'

		const tweetText = `Just performed a fully decentralised bridge from @${fromChainHandle} to @${toChainHandle} in just ${time} sec on @concero_io testnet using the new Concero Messaging V2.\n\nTry to break my record on https://testnet.concero.io 👇`

		const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
		window.open(shareUrl, '_blank', 'noopener,noreferrer')
	}, [executionTime, sourceChain, destinationChain])

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
