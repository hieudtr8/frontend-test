export interface Company {
	symbolCode: string;
	name: string;
	companyName: string;
	currency?: string;
	logo: string;
	marketCapitalization: number;
	peTtm?: number;
	revenueGrowthTtmYoy: number;
	currentDividendYieldTtm?: number;
}
