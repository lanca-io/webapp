import { get } from '../client'
import { type Chain } from '../../components/cards/SwapCard/types'

export const fetchChains = async (): Promise<Chain[]> => {
	const url = `${process.env.CONCERO_API_URL}/chains`
	const response = await get(url)
	if (response.status !== 200) throw new Error('no chains found')
	return response.data.data
}
