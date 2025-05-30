import { getPublicClient } from '../../../../../configuration/chains'
import { config } from '../../../../../constants/config'
import { base, baseSepolia } from 'viem/chains'
import { type Address, erc20Abi } from 'viem'
import { type Dispatch } from 'react'
import { type PoolAction, PoolActionType } from '../poolReducer/types'
import { TokenAmount } from '../../../../../utils/TokenAmount'

const chain = config.IS_TESTNET ? baseSepolia : base
const publicClient = getPublicClient(chain.id)

interface HandleBalanceProps {
	dispatch: Dispatch<PoolAction>
	from: {
		chain: {
			id: string
			providers: Array<{
				name: string
				symbol: string
			}>
		}
		token: {
			address: string
			symbol: string
			decimals: number
		}
	}
	address: Address | null | undefined
}

export async function handleFetchBalance({ from, address, dispatch }: HandleBalanceProps) {
	if (!from || !address) {
		dispatch({ type: PoolActionType.SET_BALANCE, payload: null })
		return
	}

	try {
		const tokenBalance = await publicClient.readContract({
			address: from.token.address as `0x${string}`,
			abi: erc20Abi,
			functionName: 'balanceOf',
			args: [address],
		})

		dispatch({
			type: PoolActionType.SET_BALANCE,
			payload: {
				amount: new TokenAmount(String(tokenBalance), from.token.decimals),
				symbol: from.token.symbol,
			},
		})
	} catch (err) {
		dispatch({ type: PoolActionType.SET_BALANCE, payload: null })
	}
}
