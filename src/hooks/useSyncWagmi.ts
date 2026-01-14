import type { Chain } from 'viem'
import type { Config, CreateConnectorFn } from 'wagmi'
import type { ConceroChain } from '@/utils/chains'
import { useEffect, useMemo } from 'react'
import { convertToViemChains } from '@/utils/chains'
import { syncWagmiConfig } from '@/utils/wagmi'

export const useSyncWagmiConfig = (
	wagmiConfig: Config,
	conceroChains: ConceroChain[],
) => {
	const chains = useMemo(() => {
		const mappedChains = conceroChains
			.map(chain => convertToViemChains([chain])[0])
			.filter(Boolean) as [Chain, ...Chain[]]
		return mappedChains
	}, [conceroChains])

	useEffect(() => {
		if (chains?.length) {
			syncWagmiConfig(wagmiConfig, chains)
		}
	}, [chains.length, wagmiConfig])
}
