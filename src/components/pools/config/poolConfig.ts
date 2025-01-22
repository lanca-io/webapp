import type { Address, Chain } from 'viem'
import { config } from '../../../constants/config'
import { arbitrum, avalanche, base, polygon, optimism } from 'viem/chains'
import { baseUSDC, arbitrumUSDC, polygonUSDC, avalancheUSDC, optimismUSDC } from './usdcTokenAddresses'
import {
	parentPoolBase,
	childPoolArbitrum,
	childPoolPolygon,
	childPoolAvalanche,
	childPoolOptimism,
} from './poolMainnetAddresses'
import { parentPoolBaseSepolia, childPoolArbitrumSepolia, childPoolAvalancheFuji } from './poolTestnetAddresses'

export interface IPoolConfig {
	isParent: boolean
	chain: Chain
	conceroContract: Address
	usdcContract: Address
}

const getConceroContract = (isTestnet: boolean, mainnetAddress: Address, testnetAddress: Address): Address => {
	return isTestnet ? testnetAddress : mainnetAddress
}

export const poolConfigs: IPoolConfig[] = [
	{
		isParent: true,
		chain: base,
		conceroContract: getConceroContract(config.IS_TESTNET, parentPoolBase, parentPoolBaseSepolia),
		usdcContract: baseUSDC,
	},
	{
		isParent: false,
		chain: arbitrum,
		conceroContract: getConceroContract(config.IS_TESTNET, childPoolArbitrum, childPoolArbitrumSepolia),
		usdcContract: arbitrumUSDC,
	},
	{
		isParent: false,
		chain: polygon,
		conceroContract: childPoolPolygon,
		usdcContract: polygonUSDC,
	},
	{
		isParent: false,
		chain: avalanche,
		conceroContract: getConceroContract(config.IS_TESTNET, childPoolAvalanche, childPoolAvalancheFuji),
		usdcContract: avalancheUSDC,
	},
	{
		isParent: false,
		chain: optimism,
		conceroContract: childPoolOptimism,
		usdcContract: optimismUSDC,
	},
]

export const poolLoansInUseAbiITem = [
	{
		type: 'function',
		name: 's_loansInUse',
		inputs: [],
		outputs: [{ name: 's_loansInUse', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
]
