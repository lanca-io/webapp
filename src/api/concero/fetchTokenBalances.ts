import { type TokenBalance } from './types'
import { config } from '../../constants/config'
import { get } from '../client'

export async function fetchTokenBalances(
	dotSeparatedAddresses: Array<`${string}.${string}`>,
	walletAddress: string,
): Promise<TokenBalance | null> {
	try {
		const addresses = dotSeparatedAddresses.join(`&token_address=`)
		const url = `${config.baseURL}/tokenBalances?wallet_address=${walletAddress}&token_address=${addresses}`
		const response = await get(url)

		if (!(response.status === 200)) {
			console.error(response)
			return null
		}

		return response.data.data
	} catch (error) {
		console.error(error)
		return null
	}
}
