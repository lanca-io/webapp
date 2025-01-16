import { type Address, erc20Abi, formatUnits } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { config } from '../../../../../constants/config'
import { getPoolLiquidity } from './handleFetchPoolLiquidity'
import { abi as ParentPool } from '../../../config/abi/ParentPool.json'
import { getPublicClient } from '../../../../../web3/wagmi'
import { lpTokenBase } from '../../../config/poolMainnetAddresses'
import { lpTokenBaseSepolia } from '../../../config/poolTestnetAddresses'

const chainId = config.IS_TESTNET ? baseSepolia.id : base.id
const lpAddress = config.IS_TESTNET ? lpTokenBaseSepolia : lpTokenBase
const client = getPublicClient(chainId)
const lpTokenDecimals = 18

const readContract = async (address: Address, abi: any, functionName: string, args: any[] = []) => {
	try {
		return await client.readContract({ address, abi, functionName, args })
	} catch (error) {
		console.error(`Error reading contract function ${functionName} at address ${address}:`, error)
		throw error
	}
}

export const getUserLpTokens = async (userAddress: Address): Promise<number> => {
	const lpTokens = await readContract(lpAddress, erc20Abi, 'balanceOf', [userAddress])
	return Number(formatUnits(lpTokens as bigint, lpTokenDecimals))
}

export const getLpTotalSupply = async (): Promise<number> => {
	const totalSupply = await readContract(lpAddress, erc20Abi, 'totalSupply')
	return Number(formatUnits(totalSupply as bigint, lpTokenDecimals))
}

export const calculateLpAmount = async (amountToDeposit: bigint): Promise<bigint> => {
	const childPoolsBalance = await getPoolLiquidity(true)
	return (await readContract(lpAddress, ParentPool, 'calculateLPTokensToMint', [
		childPoolsBalance,
		amountToDeposit,
	])) as bigint
}

export const calculateWithdrawableAmount = async (clpAmount: bigint): Promise<bigint> => {
	const childPoolsBalance = await getPoolLiquidity(true)
	return (await readContract(lpAddress, ParentPool, 'calculateWithdrawableAmount', [
		childPoolsBalance,
		clpAmount,
	])) as bigint
}
