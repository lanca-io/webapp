import { get } from '../client'
import { type GetTokensParams } from '../../hooks/DataContext/types'

export const fetchTokens = async ({ chainId, offset, limit, search, address }: GetTokensParams) => {
	const searchFilter = search ? `&search=${search}` : ''
	const addressFilter = address ? `&address=${address}` : ''
	const url = `${process.env.CONCERO_API_URL}/tokens/?chain_id=${chainId}&offset=${offset}&limit=${limit}${searchFilter}${addressFilter}`

	const response = await get(url)
	if (response.status !== 200) throw new Error(response.statusText)
	return response.data.data
}
