export const zeroAddress = '0x0000000000000000000000000000000000000000'

export const ADMIN_TOKEN_STORAGE_KEY = 'access-token-admin';
export const TOKEN_STORAGE_KEY = 'access-token';
export const ADDRESS_STORAGE_KEY = 'wallet-address';

type CurrenciesIndex = 56 | 1 | 4;
type SupportedNetworks = 43113 | 43114;
export const DefaultChainID = parseInt(process.env.NEXT_PUBLIC_REACT_APP_NETWORK_ID || '43113') as SupportedNetworks

export const ChainList = {
	56: 'BSC mainnet',
	97: 'BSC Testnet',
};

export const COMMON_STAKE_MULTIPLIER = 1000;
export const SHINY_STAKE_MULTIPLIER = 20000;
export const COMPLETE_SET_STAKE_MULTIPLIER = 20000;
export const COMPLETE_SHINY_SET_STAKE_MULTIPLIER = 400000;
export const COMPLETE_COLLECTION_STAKE_MULTIPLIER = 400000;
export const COMPLETE_SHINY_COLLECTION_STAKE_MULTIPLIER = 8000000;
export const ELEMENTS = ['Light', 'Plant', 'Water', 'Fire', 'Dark'];
// badges
export const badgesData = require('./badgesData');
// .env vars
export const GRAPHQL_URL = process.env.REACT_APP_SUBGRAPH_URL
export const METADATA_BASE_URL = process.env.NEXT_PUBLIC_METADATA_BASE_URL
export const STAKING_BASE_URL = process.env.NEXT_PUBLIC_STAKING_BASE_URL
export const STAKING_BASE_URL_OLD = process.env.NEXT_PUBLIC_STAKING_BASE_URL_OLD
export const ACCOUNTS_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNTS_BASE_URL
export const ACCOUNTS_IMAGES_URL = process.env.NEXT_PUBLIC_ACCOUNTS_IMAGES_URL

export const StorageKeyPrefix = 'hodlstake_'

export const StorageLockIDKeyPrefix = 'hodlstake_lock_'

export const DefaultAvatar = '/default.webp';

export const DefaultArt = '/defaultArt.png';

export const Currencies = {
	56: [
		{
			id: 'binancecoin',
			name: 'BNB',
			address: zeroAddress,
			symbol: 'BNB',
			chainId: 56,
			decimals: 18,
			icon: '',
		},
		{
			id: 'binance-usd',
			name: 'BUSD',
			address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
			symbol: 'BUSD',
			chainId: 56,
			decimals: 18,
			icon: '',
		},
	],
	1: [
		{
			id: 'eth',
			name: 'ETH',
			address: zeroAddress,
			symbol: 'ETH',
			chainId: 4,
			decimals: 18,
			icon: '',
		},
		{
			id: 'aka',
			name: 'Akbash Inu',
			address: '0xc4dc80eafb85c1503af64c5bffaf911121acfa57',
			symbol: 'AKA',
			chainId: 4,
			decimals: 18,
			icon: '',
		},
	],
	4: [
		{
			id: 'eth',
			name: 'ETH',
			address: zeroAddress,
			symbol: 'ETH',
			chainId: 4,
			decimals: 18,
			icon: '',
		},
		{
			id: 'aka',
			name: 'Akbash Inu',
			address: '0xc4dc80eafb85c1503af64c5bffaf911121acfa57',
			symbol: 'AKA',
			chainId: 4,
			decimals: 18,
			icon: '',
		},
	],
	43113: [
		{
			id: 'eth',
			name: 'ETH',
			address: zeroAddress,
			symbol: 'ETH',
			chainId: 4,
			decimals: 18,
			icon: '',
		},
		{
			id: 'aka',
			name: 'Akbash Inu',
			address: '0xc4dc80eafb85c1503af64c5bffaf911121acfa57',
			symbol: 'AKA',
			chainId: 4,
			decimals: 18,
			icon: '',
		},
	],
	43114: []
}