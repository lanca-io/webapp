import { type Address, erc20Abi, formatUnits } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { config } from '../../../../../constants/config'
import { getPoolLiquidity } from './handleFetchPoolLiquidity'
import { abi as ParentPool } from '../../../config/abi/ParentPool.json'
import { getPublicClient } from '../../../../../web3/wagmi'
import { lpTokenBase, parentPoolBase } from '../../../config/poolMainnetAddresses'
import { lpTokenBaseSepolia, parentPoolBaseSepolia } from '../../../config/poolTestnetAddresses'

const chainId = config.IS_TESTNET ? baseSepolia.id : base.id
const lpAddress = config.IS_TESTNET ? lpTokenBaseSepolia : lpTokenBase
const parentPool = config.IS_TESTNET ? parentPoolBaseSepolia : parentPoolBase
const client = getPublicClient(chainId)
const lpTokenDecimals = 18

export const getUserLpTokens = async (userAddress: Address): Promise<number> => {
	const lpTokens = await client.readContract({
		address: lpAddress,
		abi: erc20Abi,
		functionName: 'balanceOf',
		args: [userAddress],
	})

	return Number(formatUnits(lpTokens, lpTokenDecimals))
}

export const getLpTotalSupply = async () => {
	const totalSupply = await client.readContract({
		address: lpAddress,
		abi: erc20Abi,
		functionName: 'totalSupply',
	})

	return Number(formatUnits(totalSupply, lpTokenDecimals))
}

export const calculateLpAmount = async (amountToDeposit: bigint): Promise<bigint> => {
	const childPoolsBalance = await getPoolLiquidity(true)

	return (await client.readContract({
		address: parentPool,
		abi: ParentPool,
		functionName: 'calculateLPTokensToMint',
		args: [childPoolsBalance, amountToDeposit],
	})) as bigint
}

export const calculateWithdrawableAmount = async (clpAmount: bigint): Promise<bigint> => {
	const childPoolsBalance = await getPoolLiquidity(true)

	return (await client.readContract({
		address: parentPool,
		abi: ParentPool,
		functionName: 'calculateWithdrawableAmount',
		args: [childPoolsBalance, clpAmount],
	})) as bigint
}
