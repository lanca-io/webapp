import { type Dispatch } from 'react'
import { type SwapAction } from '../components/cards/SwapCard/swapReducer/types'
import { TokenAmount } from './TokenAmount'
import { configChainsViem } from '../web3/wagmi'
import { createPublicClient, formatUnits, getContract, http } from 'viem'
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
	dispatch({ type: 'SET_BALANCE', payload: null })
}

export async function getBalance({ dispatch, from, address }: HandleBalanceProps) {
	if (!from || !address) {
		handleError(dispatch)
		return
	}

	try {
		const publicClient = createPublicClient({
			chain: configChainsViem[Number(from.chain.id)],
			transport: http(),
		})

		const tokenFromContract = getContract({
			address: from.token.address as `0x${string}`,
			abi: ERC20,
			client: publicClient,
		})

		let userBalanceAmount = 0n

		if (from.token.address === config.NULL_ADDRESS) {
			userBalanceAmount = await publicClient.getBalance({
				address,
			})
		} else {
			userBalanceAmount = await tokenFromContract.read.balanceOf([address])
		}

		dispatch({
			type: 'SET_BALANCE',
			payload: {
				amount: new TokenAmount(String(userBalanceAmount), from.token.decimals),
				symbol: from.token.symbol,
			},
		})
	} catch (err) {
		handleError(dispatch)
	}
}
