import { type Abi, decodeEventLog } from 'viem'
import { type Log } from 'viem/types/log'
import { type DecodeEventLogReturnType } from 'viem/utils/abi/decodeEventLog'

interface Options {
	log: Log
	abi: Abi
}

export const decodeEventLogWrapper = ({ log, abi }: Options): DecodeEventLogReturnType | null => {
	try {
		return decodeEventLog({
			abi,
			data: log.data,
			topics: log.topics as [] | [signature: `0x${string}`, ...args: Array<`0x${string}`>],
		})
	} catch (error) {
		return null
	}
}
