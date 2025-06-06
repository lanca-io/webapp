import { type Dispatch } from 'react'
import { SwapActionType, type SwapAction } from '../components/cards/SwapCard/swapReducer/types'
import { getPublicClient } from '../configuration/chains'
import { TokenAmount } from './TokenAmount'
import { type Address, getContract } from 'viem'
import ERC20 from '../abi/ERC20.json'
import { config } from '../constants/config'

interface HandleBalanceProps {
	dispatch: Dispatch<SwapAction>
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
	address: string | null | undefined
}

const handleError = (dispatch: Dispatch<SwapAction>) => {
	dispatch({ type: SwapActionType.SET_BALANCE, payload: null })
}

export async function getBalance({ dispatch, from, address }: HandleBalanceProps) {
	if (!from || !address) {
		handleError(dispatch)
		return
	}

	try {
		const client = getPublicClient(Number(from.chain.id))
		const tokenFromContract = getContract({
			address: from.token.address as Address,
			abi: ERC20,
			client,
		})

		let userBalanceAmount = 0n

		if (from.token.address === config.NULL_ADDRESS) {
			userBalanceAmount = await client.getBalance({
				address: address as Address,
			})
		} else {
			userBalanceAmount = (await tokenFromContract.read.balanceOf([address])) as bigint
		}

		dispatch({
			type: SwapActionType.SET_BALANCE,
			payload: {
				amount: new TokenAmount(String(userBalanceAmount), from.token.decimals),
				symbol: from.token.symbol,
			},
		})
	} catch (err) {
		handleError(dispatch)
	}
}
