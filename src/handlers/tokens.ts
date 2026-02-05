import axios from 'axios'

export async function handleFetchBalances(chainId: string, address: string) {
	if (!address) return null

	const url = `https://api.v2.concero.io/api/v1/balances`
	const params = {
		wallet_address: address,
		chain_id: chainId,
	}

	try {
		const response = await axios.get(url, { params })
		return response.data.payload?.data?.[chainId] || null
	} catch (error) {
		return null
	}
}

export const handleFetchTokens = async (
	chainId?: string,
	offset?: number,
	limit?: number,
	search?: string,
	address?: string,
): Promise<any[]> => {
	const params: Record<string, string> = {
		chain_id: chainId || '',
		offset: offset?.toString() || '0',
		limit: limit?.toString() || '15',
		address: address?.toLowerCase() || '',
	}

	if (search) {
		params.search = search
	}

	try {
		const response = await axios.get(
			`https://api.v2.concero.io/api/v1/tokens`,
			{ params },
		)
		if (response.status !== 200) throw new Error(response.statusText)
		return response.data.payload.tokens
	} catch (error) {
		console.warn('Error fetching tokens:', error)
		return []
	}
}
