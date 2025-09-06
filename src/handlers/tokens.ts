import type { TokenBalance } from '../api/concero/types'
import { get } from '../api/client'

export async function handleFetchBalances(chainId: string, address: string): Promise<TokenBalance | null> {
	if (!address) return null

	const url = `https://api.v2.concero.io/api/v1/balances`
	const params = {
		wallet_address: address,
		chain_id: chainId,
	}

	try {
		const response = await get(url, params)
		return response.data.payload?.data?.[chainId] || null
	} catch (error) {
		return null
	}
}

export const handleFetchTokens = async (chainId?: string, offset?: number, limit?: number, search?: string) => {
	const params = new URLSearchParams({
		chain_id: chainId || '',
		offset: offset?.toString() || '0',
		limit: limit?.toString() || '15',
	})

	if (search) {
		params.append('search', search)
	}

	const url = `https://api.v2.concero.io/api/v1/tokens?${params.toString()}`

	try {
		const response = await get(url)
		if (response.status !== 200) throw new Error(response.statusText)
		return response.data.payload.tokens
	} catch (error) {
		console.warn('Error fetching tokens:', error)
		return []
	}
}
