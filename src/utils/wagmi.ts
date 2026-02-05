import type { Config } from 'wagmi'
import type { Chain } from 'viem'
import { reconnect } from 'wagmi/actions'

export const syncWagmiConfig = async (
	wagmiConfig: Config,
	chains: readonly [Chain, ...Chain[]],
) => {
	wagmiConfig._internal.chains.setState(chains)
	wagmiConfig._internal.connectors.setState(() =>
		[
			...(wagmiConfig._internal.mipd
				?.getProviders()
				.map(wagmiConfig._internal.connectors.providerDetailToConnector) ?? []),
		].map(wagmiConfig._internal.connectors.setup),
	)
	reconnect(wagmiConfig)
}
