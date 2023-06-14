const badgesData = [
	{
		id: 1,
		name: 'VIP 1',
		propertyName: 'vip1',
		type: 'Account Level',
		counter: 10,
		points: 0,
		description: 'Engage with the Hatchy ecosystem to level up your VIP account. You have collected (0) Account Points.',
		rule: 'Collect 10 points'
	},
	{
		id: 2,
		name: 'VIP 2',
		propertyName: 'vip2',
		type: 'Account Level',
		counter: 50,
		points: 0,
		description: 'Engage with the Hatchy ecosystem to level up your VIP account. You have collected (0) Account Points.',
		rule: 'Collect 50 points'
	},
	{
		id: 3,
		name: 'VIP 3',
		propertyName: 'vip3',
		type: 'Account Level',
		counter: 250,
		points: 0,
		description: 'Engage with the Hatchy ecosystem to level up your VIP account. You have collected (0) Account Points.',
		rule: 'Collect 250 points'
	},
	{
		id: 4,
		name: 'VIP 4',
		propertyName: 'vip4',
		type: 'Account Level',
		counter: 1000,
		points: 0,
		description: 'Engage with the Hatchy ecosystem to level up your VIP account. You have collected (0) Account Points.',
		rule: 'Collect 1000 points'
	},
	{
		id: 5,
		name: 'Gen 1 Sage',
		propertyName: 'gen1Sage',
		type: 'Gen 1 - General Collection milestones',
		points: 500,
		counter: 39,
		counterProperty: 'hatchyStats.gen1.wallet.totalUniqueShiny',
		description: 'Complete shiny collection with all monsters shiny versions.',
		rule: 'User has monster ID 1-39 with isShiny:TRUE in collection'
	},
	{
		id: 6,
		name: 'Gen 1 Master',
		propertyName: 'gen1Master',
		type: 'Gen 1 - General Collection milestones',
		points: 50,
		counter: 39,
		counterProperty: 'hatchyStats.gen1.wallet.totalUniqueCommon',
		description: 'Complete common collection with all monsters common versions.',
		rule: 'Obtain Hatchies ID 1-39 in collection'
	},
	{
		id: 7,
		name: 'Void Master',
		propertyName: 'voidMaster',
		type: 'Gen 1 - General Collection milestones',
		points: 20,
		counter: 1,
		counterProperty: 'hatchyStats.gen1.wallet.void.uniqueShiny.length',
		description: 'Collect all Hatchies in the Void set.',
		rule: 'Obtain Hatchie ID 0 - celestion'
	},
	{
		id: 8,
		name: 'Leaf Master',
		propertyName: 'leafMaster',
		type: 'Gen 1 - General Collection milestones',
		points: 10,
		counter: 9,
		counterProperty: 'hatchyStats.gen1.wallet.plant.uniqueCommon.length',
		description: 'Collect all Hatchies in the Leaf set.',
		rule: 'Obtain Hatchies ID 1-9'
	},
	{
		id: 9,
		name: 'Water Master',
		propertyName: 'waterMaster',
		type: 'Gen 1 - General Collection milestones',
		points: 10,
		counter: 9,
		counterProperty: 'hatchyStats.gen1.wallet.water.uniqueCommon.length',
		description: 'Collect all Hatchies in the Water set.',
		rule: 'Obtain Hatchies ID 10-18'
	},
	{
		id: 10,
		name: 'Fire Master',
		propertyName: 'fireMaster',
		type: 'Gen 1 - General Collection milestones',
		points: 10,
		counter: 9,
		counterProperty: 'hatchyStats.gen1.wallet.fire.uniqueCommon.length',
		description: 'Collect all Hatchies in the Fire set.',
		rule: 'Obtain Hatchies ID 19-27'
	},
	{
		id: 11,
		name: 'Light Master',
		propertyName: 'lightMaster',
		type: 'Gen 1 - General Collection milestones',
		points: 10,
		counter: 6,
		counterProperty: 'hatchyStats.gen1.wallet.light.uniqueCommon.length',
		description: 'Collect all Hatchies in the Light set.',
		rule: 'Obtain Hatchies ID 28-33'
	},
	{
		id: 12,
		name: 'Dark Master',
		propertyName: 'darkMaster',
		type: 'Gen 1 - General Collection milestones',
		points: 10,
		counter: 6,
		counterProperty: 'hatchyStats.gen1.wallet.dark.uniqueCommon.length',
		description: 'Collect all Hatchies in the Dark set.',
		rule: 'Obtain Hatchies ID 34-39'
	},
	{
		id: 13,
		name: 'Hatchy Squad',
		propertyName: 'hatchySquad',
		type: 'Engagement Badges',
		points: 1,
		badgeType: 'ownAsset',
		description: 'Own 1 Hatchie.',
		rule: 'Owns a hatchy'
	},
	{
		id: 21,
		name: 'Gen 1 Testnet Master',
		propertyName: 'gen1TestnetMaster',
		type: 'Engagement Badges',
		points: 50,
		counter: 39,
		counterProperty: 'hatchyStats.gen1.testnetWallet.totalUniqueCommon',
		description: 'Complete the gen 1 collection on fuji testnet.',
		rule: 'Collected gen 1 full set on testnet'
	},
	{
		id: 22,
		name: 'Gen 2 Testnet Master',
		propertyName: 'gen2TestnetMaster',
		type: 'Engagement Badges',
		points: 50,
		counter: 39,
		counterProperty: 'hatchyStats.gen2.testnetWallet.totalUniqueCommon',
		description: 'Complete the gen 2 collection on fuji testnet.',
		rule: 'Collected gen 2 full set on testnet'
	},
	{
		id: 23,
		name: 'Gen 1 Testnet Sage',
		propertyName: 'gen1TestnetSage',
		type: 'Engagement Badges',
		points: 500,
		counter: 39,
		counterProperty: 'hatchyStats.gen1.testnetWallet.totalUniqueShiny',
		description: 'Complete the SHINY gen 1 collection on fuji testnet.',
		rule: 'Collected SHINY gen 1 full set on testnet'
	},
	{
		id: 24,
		name: 'Gen 2 Testnet Sage',
		propertyName: 'gen2TestnetSage',
		type: 'Engagement Badges',
		points: 500,
		counter: 39,
		counterProperty: 'hatchyStats.gen2.testnetWallet.totalUniqueShiny',
		description: 'Complete the SHINY gen 2 collection on fuji testnet.',
		rule: 'Collected SHINY gen 2 full set on testnet'
	}
]


const hatchyStats = {
	totalCommon: 0,
	totalUniqueCommon: 0,
	totalShiny: 0,
	totalUniqueShiny: 0,
	void: {
		totalShiny: 0,
		uniqueShiny: [],
	},
	plant: {
		totalCommon: 0,
		uniqueCommon: [],
		totalShiny: 0,
		uniqueShiny: [],
	},
	water: {
		uniqueCommon: [],
		uniqueShiny: [],
	},
	fire: {
		uniqueCommon: [],
		uniqueShiny: [],
	},
	dark: {
		uniqueCommon: [],
		uniqueShiny: [],
	},
	light: {
		uniqueCommon: [],
		uniqueShiny: [],
	}
}

const defaultUserBadgeInfo = {
	accountLevel: 'default',
	points: 0,
	hatchyStats: {
		gen1: {
			testnetWallet: hatchyStats,
			testnetStaking: hatchyStats,
			wallet: hatchyStats,
			staking: hatchyStats
		},
		gen2: {
			testnetWallet: hatchyStats,
			testnetStaking: hatchyStats,
			wallet: hatchyStats,
			staking: hatchyStats
		},
	},
	badges: {
		vip1: {
			id: 1,
			unlocked: false,
			progress: 0
		},
		vip2: {
			id: 2,
			unlocked: false,
			progress: 0
		},
		vip3: {
			id: 3,
			unlocked: false,
			progress: 0
		},
		vip4: {
			id: 4,
			unlocked: false,
			progress: 0
		},
		hatchyTestnet: {
			id: 20,
			unlocked: true
		}
	}
}

const badgesImgs = [
	'DAO',
	'darkMaster',
	'egg_Default',
	'egg_Lunar',
	'egg_Solar',
	'fireMaster',
	'gen1TestnetSage',
	'gen2TestnetSage',
	'IC1',
	'IC2',
	'leafMaster',
	'lightMaster',
	'TRE',
	'voidMaster',
	'waterMaster'
]

export { badgesData, badgesImgs };