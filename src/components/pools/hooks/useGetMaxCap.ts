import { formatUnits } from 'viem'
import { base, baseSepolia } from 'wagmi/chains'
import { abi } from '../config/abi/ParentPool.json'
import { usdcDecimals } from '../config/usdcTokenAddresses'
import { config } from '../../../constants/config'
import { getPublicClient } from '../../../web3/wagmi'
import { parentPoolBase } from '../config/poolMainnetAddresses'
import { parentPoolBaseSepolia } from '../config/poolTestnetAddresses'

// Move this to handlers/useGetMaxCap.ts

export const getMaxCap = async (): Promise<number | undefined> => {
	try {
		const { IS_TESTNET } = config
		const chainId = IS_TESTNET ? baseSepolia.id : base.id
		const poolAddress = IS_TESTNET ? parentPoolBaseSepolia : parentPoolBase

		const client = getPublicClient(chainId)

		const liquidityCap = await client.readContract({
			address: poolAddress,
			abi,
			functionName: 'getLiquidityCap',
		})

		return Number(formatUnits(BigInt(liquidityCap as number), usdcDecimals))
	} catch (error) {
		console.error('Error fetching max cap:', error)
	}
}
