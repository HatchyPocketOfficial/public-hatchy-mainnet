const elementsColors = {
	Dark: '#680E59',
	Light: '#FFDC62',
	Plant: '#44FF4C',
	Water: '#4FD5FF',
	Fire: '#DF3333',
	Void: '#680E59',
}

export const elementsLimits = {
	gen1:{
		light: {
			min: 34,
			max: 40
		},
		plant: {
			min: 1,
			max: 10
		},
		water: {
			min: 10,
			max: 19
		},
		fire: {
			min: 19,
			max: 28
		},
		dark: {
			min: 28,
			max: 34
		},
		void: {
			min: 0,
			max: 0
		}
	},
	gen2:{
		plant: {
			min: 40,
			max: 63
		},
		water: {
			min: 63,
			max: 86
		},
		fire: {
			min: 86,
			max: 109
		},
		dark: {
			min: 109,
			max: 123
		},
		light: {
			min: 123,
			max: 137
		},
		dragon: {
			min: 137,
			max: 143
		},
	}
}

export type Element = 'Dark' | 'Light' | 'Plant' | 'Water' | 'Fire' | 'Void'
export type ElementLower = 'dark' | 'light' | 'plant' | 'water' | 'fire';
/** get hexadecimal color based on the element, used for the hatchy icons frame */
export const getElementColor = (element: string) => elementsColors[element as Element];

export type Hatchy = {
	name: string
	element: string //"Void" | "Plant" | "Water" | "Fire" | "Dark" | "Light"
	monsterId: number
	image: string
	shiny: string
	framed: string
	sound: string
	description: string
	height: number
	weight: number
}

export type HatchyStatsObject = {
	[key: string]: HatchyStats
}

export type HatchyStats = {
	count: number
	monsterId: number
	shiny: boolean
	shinyCount: number
	stakedCount: number
	tokenId: string | undefined
}

export type Metadatas = {
	[key: string]: Metadata
}

export type Metadata = {
	name: string
	element: string //"Void" | "Plant" | "Water" | "Fire" | "Dark" | "Light"
	monsterId: number
	image: string
	shiny: string
	framed: string
	sound: string
	description: string
	height: number
	weight: number
	quantity?: number // Gen2 ERC1155 tokens only
	commonQuantity?: number // Gen2 ERC1155 tokens only
	shinyQuantity?: number // Gen2 ERC1155 tokens only
	newQuantity?: number // new quantity after hatch an egg
	newCommonQuantity?: number
	newShinyQuantity?: number
	tokenId?: number
	id?: number
	character?: number
	serial?: number
	isShiny?: number
	atributes?: Array<{
		trait_type: string
		value: boolean
	}>
	rarity?: string
	isStaked?: boolean
	error?: string
}

export type BasicGen2Metadata = {
	monsterId: number,
	quantity: number
}

export type MarketplaceMetadata = {
	character: number;
	element: string;
	id: number;
	isOnSale: boolean;
	isShiny: number;
	monsterId: number;
	name: string;
	owner: string;
	price: string;
	serial: number;
	tokenId: string;
}

export type StakeMetadata = {
	action?: string;
	character: number;
	description: string;
	element: string;
	elementId: number;
	framed: string;
	height: number;
	id: number;
	image: string;
	isShiny: number;
	monsterId: number;
	name: string;
	serial: number;
	shiny: string;
	sound: string;
	tokenId: number;
	weight: number;
	collection: string;
	imageBuffer?: any,
	type: string;
	uri: string;
	creator: string;
	liked?: string | number;
	mintable: boolean;
	count: number;
	currency: string;
	price: string | number;
	usdPrice?: string | number;
	auctionable: boolean;
	startTime?: number;
	endTime?: number;
	timeRemaining?: string;
	requireAKA?: number | string;
	owner: ArtistModel | null
	commonQuantity?: number 
	shinyQuantity?: number 
}

export type BatchStakeMetadata = {
	tokenId: number
	monsterId: number
	isShiny: number
	character: number
	serial: number
	weight: number
	element: string
	elementId: number
	signData: any
}

export type StakedHatchies = {
	plant: StakeMetadata[]
	water: StakeMetadata[]
	fire: StakeMetadata[]
	dark: StakeMetadata[]
	light: StakeMetadata[]
}

export interface NFTModel {
	id: number;
	collection: string;
	tokenId: number;
	name: string;
	description: string;
	image: string;
	imageBuffer?: any,
	type: string;
	uri: string;
	creator: string;
	liked?: string | number;
	mintable: boolean;
	count: number;
	currency: string;
	price: string | number;
	usdPrice?: string | number;
	auctionable: boolean;
	startTime?: number;
	endTime?: number;
	timeRemaining?: string;
	requireAKA?: number | string;
	owner: ArtistModel | null
}

//Accounts
export interface AccountsAPIResponse {
	code: number
	message: string
	data: any
}

export interface UserModel {
	_id: string,
	userId: string,
	address: string,
	bio: string,
	createdAt: string,
	email: string,
	email_verify: number,
	lastViewedAt: string,
	referrals: UserModel[],
	referrer: string,
	updatedAt: string,
	username: string,
	avatar?: string,
	email_status?: number,
	following?: number,
	follower?: number,
	likes?: number,
	liked?: number,
	admin?: boolean,
	socialLink?: string,
	worth?: number,
	privilege?: number,
	accountLevel?: string,
	badges?: BadgeObject,
	hatchySatus?: Array<{}>,
	points: number;
}


export interface BadgeObject {
	[key: string]: BadgeProgress
}

export interface FriendModel {
	_id: string,
	userId: string,
	address: string,
	username: string,
	email: string,
	bio: string,
	lastViewedAt: string,
	friendMode: string,
	friendCreatedAt: string,
	friendUpdatedAt: string
	avatar?: string,
}

export interface Avatar {
	_id: string,
	image: string,
	name: string,
	description: string,
	category: string,
	badge: string,
	register: string,
	actived: number,
	createdAt: string,
	updatedAt: string,
	unlocked: boolean
}

export interface Referral {
	profilePicture: string,
	name: string,
	points: number
}
export interface Badge {
	id?: number,
	name?: string,
	propertyName?: string,
	type?: string,
	counter?: number,
	points?: number,
	imageSrc?: string,
	description?: string,
	rule?: string
}

export interface BadgeProgress {
	id: number,
	unlocked?: boolean,
	progress: number,
	counter?: number
}

export interface Category {
	_id?: string,
	category?: string,
	register?: string,
	actived?: number,
	createdAt?: string,
	updatedAt?: string
}

export interface ArtistModel {
	address?: string,
	nonce?: number,
	fullname: string,
	username: string,
	description?: string,
	following?: number,
	follower?: number,
	likes?: number,
	liked?: number,
	admin?: boolean,
	socialLink?: string,
	image: string,
	created?: Art[] | null,
}

export interface HistoryModel {
	id: number,
	creator: string,
	date: string,
	time: string,
	price: string,
	usdPrice: string
	type: string,
	userImage: string
}

export interface Art {
	id: number,
	image: string
}

export interface NFTDataModel {
	title: string,
	description: string,
	fixedPrice: string,
	paidIn: PaidInType,
	noOfEditions: number,
	type: NFTType,
	image: any
}

export interface Admin {
	_id: string
	name: string
	username: string
	allowed: number
	role: number
	createdAt: string
	updatedAt: string
}

//verify type
export type Price = {
	usd: number
}

export type Tokens = {
	[key: string]: any
}

export enum PaidInType {
	BNB = 'bnb',
	BITCOIN = 'bitcoin'
}

export enum NFTType {
	Fixed = 'fixed',
	Timed = 'timed',
}

export enum AssetType {
	NONE = 'none',
	IMAGE = 'image',
	AUDIO = 'audio',
	VIDEO = 'video'
}

export type Gen2AmountData = {
	monsterId: number
	shinyAmount: string
	commonAmount: string
}

export type SelectedHatchiesAmount = {
	[key: string]: Gen2AmountData
}

export type SetsInfo = {
	total: number
	plant: number
	water: number
	fire: number
	light: number
	dark: number
	dragons?: number
	voids?: number
	collections?: number
}