export interface Protocol {
	_id: string
	defillamaId: string
	breakdown24h: {
		key: {
			key: string
		}
	}
	category: string
	chains: string[]
	change_id: number
	change_1m: number
	change_30dover30d: number
	change_7d: number
	change_7dover7d: number
	dailyBribesRevenue: number
	dailyCreatorRevenue: number
	dailyFees: number
	dailyHoldersRevenue: number
	dailyProtocolRevenue: number
	dailyRevenue: number
	dailySupplySideRevenue: number
	dailyUserFees: number
	disabled: boolean
	displayName: string
	holdersRevenue30d: number
	latestFetchIsOk: boolean
	logoURI: string
	methodology: {
		UserFees: string
		Fees: string
		Revenue: string
		ProtocolRevenue: string
		HoldersRevenue: string
		SupplySideRevenue: string
	}
	methodologyURL: string
	module: string
	name: string
	parentProtocol: string
	protocolType: string
	total14dto7d: number
	total24h: number
	total30d: number
	total48hto24h: number
	total60dto30d: number
	total7d: number
	totalAllTime: number
	versionKey: string
	address: string
	audit_links: string[]
	audit_note: string
	audits: string
	chain: string
	cmcId: string
	description: string
	forkedFrom: string[]
	gecko_id: string
	listedAt: number
	oracles: string[]
	symbol: string
	twitter: string
	url: string
}
