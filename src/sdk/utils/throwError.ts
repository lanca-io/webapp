import type { Hash } from 'viem'

export interface ErrorProps {
	txHash?: Hash
	message?: string
}

export const throwError = ({ txHash, message = 'Failed transaction' }: ErrorProps) => {
	const error = new Error(message)
	error.data = { txHash }

	throw error
}
