import { Element, ElementLower, elementsLimits, HatchyStats, HatchyStatsObject, Metadata, Metadatas, StakedHatchies, StakeMetadata } from "../types";
import dataGen1 from "../public/static/characters-gen1.json";
import dataGen2 from "../public/static/characters-gen2.json";

const hatchiesDataGen1: Metadatas = dataGen1;
const hatchiesDataGen2: Metadatas = dataGen2;

export const getGen2ShinyIds = () => {
	const arr: number[] = [];
	for (let i = 40; i < 143; i++) {
		const id = (i).toString() + '888';
		arr.push(parseInt(id));
	}
	return arr;
}

export const getShinyCardFilename = (hatchy: Metadata) => {
	return `/static/cards/gen${hatchy.monsterId < 40 ? 1 : 2}/${hatchy.element.toLowerCase()}/${hatchy.shiny.toLowerCase()}`;
}
export const getCommonCardFilename = (hatchy: Metadata) => {
	return `/static/cards/gen${hatchy.monsterId < 40 ? 1 : 2}/${hatchy.element.toLowerCase()}/${hatchy.framed.toLowerCase()}`;
}

export const createRangeArray = (start: number, end: number) => {
	const arr = [];
	for (let i = start; i < end; i++) arr.push(i);
	return arr;
}

export const getHatchiesFilteredByMonsterID = (
	showShinyOnly: boolean,
	monsterId: number,
	walletMetadatas?: Metadata[] | null,
	stakedMetadatas?: Metadata[] | null
) => {
	stakedMetadatas = stakedMetadatas?.map(hatchy => ({ ...hatchy, isStaked: true }));
	const sameTokens = walletMetadatas?.concat(stakedMetadatas ? stakedMetadatas : []).filter(hatchy => {
		if (showShinyOnly) { //shiny filter on
			// return true if you own the hatchy and it is shiny
			return isShinyHatchy(hatchy) && hatchy.monsterId == monsterId
		} else {
			// return true if you own the hatchy
			return hatchy.monsterId == monsterId
		}
	})
	return sameTokens;
}

export const isShinyHatchy = (hatchy: Metadata) => {
	return hatchy.isShiny == 1 || (hatchy.shinyQuantity != null && hatchy.shinyQuantity > 0);
}

const getFilteredHatchy = (hatchy: Metadata, staked: boolean) => {
	return {
		monsterId: hatchy.monsterId,
		tokenId: hatchy.tokenId,
		shiny: isShinyHatchy(hatchy),
		count: hatchy.quantity || 1,
		shinyCount: isShinyHatchy(hatchy) ? (hatchy.shinyQuantity || 1) : 0,
		stakedCount: staked ? (hatchy.quantity || 1) : 0
	}
}

export const getHatchieFilteredCount = (
	showShinyOnly: boolean,
	gen: number,
	walletMetadatas?: Metadata[] | null,
	stakedMetadatas?: Metadata[] | null,
) => {
	const filteredMetadatas: HatchyStatsObject = {};
	// count stake hatchies
	stakedMetadatas?.filter((hatchy) =>
		showShinyOnly ? isShinyHatchy(hatchy) : true
	).
		forEach(hatchy => {
			if (filteredMetadatas[hatchy.monsterId]) {
				filteredMetadatas[hatchy.monsterId].count += (hatchy.quantity || 1);
				filteredMetadatas[hatchy.monsterId].stakedCount += (hatchy.quantity || 1);
				if (isShinyHatchy(hatchy)) {
					filteredMetadatas[hatchy.monsterId].shiny = true;
					filteredMetadatas[hatchy.monsterId].shinyCount += (hatchy.shinyQuantity || 1);
				}
			} else {
				filteredMetadatas[hatchy.monsterId] = getFilteredHatchy(hatchy, true) as HatchyStats
			}
		});

	// count non staked hatchies
	walletMetadatas?.filter((hatchy) =>
		showShinyOnly ? isShinyHatchy(hatchy) : true
	).
		forEach((hatchy, i) => {
			if (filteredMetadatas[hatchy.monsterId]) {
				filteredMetadatas[hatchy.monsterId].count += (hatchy.quantity || 1);
				if (isShinyHatchy(hatchy)) {
					filteredMetadatas[hatchy.monsterId].shiny = true;
					filteredMetadatas[hatchy.monsterId].shinyCount += (hatchy.shinyQuantity || 1);
				}
			} else {
				filteredMetadatas[hatchy.monsterId] = getFilteredHatchy(hatchy, false) as HatchyStats
			}
		});
	return filteredMetadatas;
}

export const getDragonData = (gen: number, element: Element) => {
	const hatchiesData = getHatchiesData(gen);
	const dragons: { [key: string]: Metadata } = {
		Light: hatchiesData[141],
		Plant: hatchiesData[137],
		Water: hatchiesData[138],
		Fire: hatchiesData[139],
		Dark: hatchiesData[140],
		Void: hatchiesData[142],
	}
	return dragons[element];
}
export const getHatchieData = (monsterId: number) => {
	if (monsterId < 40)
		return hatchiesDataGen1[monsterId];
	else
		return hatchiesDataGen2[monsterId];
}

export const getHatchiesData = (gen: number): Metadatas => {
	if (gen === 1)
		return hatchiesDataGen1;
	else
		return hatchiesDataGen2;
}

export const getHatchiesDataArray = (gen: number): Metadata[] => {
	const metadatas = [];
	if (gen === 1) {
		for (var key in hatchiesDataGen1) {
			metadatas.push(hatchiesDataGen1[key]);
		};
	} else {
		for (var key in hatchiesDataGen2) {
			metadatas.push(hatchiesDataGen2[key]);
		};
	}
	return metadatas;
}

export const isStaked = (
	tokenId: number,
	stakedHatchiesElement: StakeMetadata[] | null
) => {
	if (stakedHatchiesElement == null) return false;
	for (const hatchy of stakedHatchiesElement) {
		if (hatchy.tokenId == tokenId) {
			return true;
		}
	}
	return false;
}

export const countQuantity = (
	monsterId: number,
	stakedHatchiesElement?: StakeMetadata[] | null,
	metadatas?: Metadata[] | null
) => {
	let inStake = 0;
	let inWallet = 0;
	stakedHatchiesElement?.forEach((hatchy) => {
		if (hatchy.id === monsterId) {
			inStake++;
		}
	})
	metadatas?.forEach((hatchy) => {
		if (hatchy.id === monsterId) {
			inWallet++;
		}
	})
	const total = inStake + inWallet;
	return total;
}

export const countShiny = (
	stakedHatchiesElement: StakedHatchies | null,
) => {
	if (stakedHatchiesElement == null) return 0;
	//can't count shiny because every staked hatchie have isShiny=1
	const resDark = stakedHatchiesElement['dark'].filter((hatchy) => hatchy.isShiny === 1).length;
	const resLight = stakedHatchiesElement['light'].filter((hatchy) => hatchy.isShiny === 1).length;
	const resPlant = stakedHatchiesElement['plant'].filter((hatchy) => hatchy.isShiny === 1).length;
	const resFire = stakedHatchiesElement['fire'].filter((hatchy) => hatchy.isShiny === 1).length;
	const resWater = stakedHatchiesElement['water'].filter((hatchy) => hatchy.isShiny === 1).length;
	return resDark + resLight + resPlant + resFire + resWater;
}

export const countCommon = (
	stakedHatchiesElement: StakedHatchies | null,
) => {
	if (stakedHatchiesElement == null) return 0;
	const resDark = stakedHatchiesElement['dark'].filter((hatchy) => !hatchy.isShiny).length;
	const resLight = stakedHatchiesElement['light'].filter((hatchy) => !hatchy.isShiny).length;
	const resPlant = stakedHatchiesElement['plant'].filter((hatchy) => !hatchy.isShiny).length;
	const resFire = stakedHatchiesElement['fire'].filter((hatchy) => !hatchy.isShiny).length;
	const resWater = stakedHatchiesElement['water'].filter((hatchy) => !hatchy.isShiny).length;
	const result = resDark + resLight + resPlant + resFire + resWater;
	return result;
}

export const countCommonStakedByElement = (stakedHatchiesElement: StakeMetadata[]) => {
	if (stakedHatchiesElement == null) return 0;
	const res = stakedHatchiesElement.filter((hatchy) => !hatchy.isShiny).length;
	//console.log(res);

	return res;
}
export const countShinyStakedByElement = (stakedHatchiesElement: StakeMetadata[]) => {
	if (stakedHatchiesElement == null) return 0;
	return stakedHatchiesElement.filter((hatchy) => hatchy.isShiny).length;
}

export function getAction(walletHatchy: Metadata | StakeMetadata, staked: boolean, tokensList: string[]) {
	if (tokensList.indexOf((walletHatchy.tokenId || walletHatchy.monsterId).toString()) === -1) {
		return 'none'
	} else {
		return staked ? 'unstake' : 'stake'
	}
}

export function countHatchies(hatchies: Metadata[], element: ElementLower, gen?:number) {
	if (!gen) gen=1;
	const countsCollection: any = {}
	const countsCollectionShiny: any = {}
	let commonCollections = 0
	let shinyCollections = 0
	let shinyCount = 0
	let commonCount = 0
	
	hatchies.map((hatchy: Metadata) => {
		const id = hatchy.monsterId.toString()
		countsCollection[id] = countsCollection[id] ? countsCollection[id] + 1 : 1
		if (hatchy.isShiny) {
			countsCollectionShiny[id] = countsCollectionShiny[id] ? countsCollectionShiny[id] + 1 : 1
		}

		if (hatchy.monsterId<40) {
			if (hatchy.isShiny) shinyCount++;
			else commonCount++
		} else {
			shinyCount+=hatchy.shinyQuantity || 0;
			commonCount+=hatchy.commonQuantity || 0;
		}
	})

	if (gen==1 && element) {
		const elementsLimitsGen = elementsLimits.gen1[element];
		const completSetCount = elementsLimitsGen.max-elementsLimitsGen.min;
		const auxArrayCommon: number[] = 	Object.values(countsCollection);
		const auxArrayShiny: number[] = 	Object.values(countsCollectionShiny);
		if (auxArrayCommon.length>=completSetCount) {
			commonCollections = Math.min(...auxArrayCommon)
		}
		if (auxArrayShiny.length>=completSetCount) {
			shinyCollections = Math.min(...auxArrayShiny)
		}
	}
	return [commonCollections-shinyCollections, shinyCollections, shinyCount, commonCount]
}


export function checkCompleteSet(
	staked: StakeMetadata[],
	element: ElementLower,
	gen?: number,
	checkForShiny?: boolean,
) {
	let elementsLimitsGen;
	if (gen == 2) {
		elementsLimitsGen = elementsLimits.gen2[element];
	} else {
		elementsLimitsGen = elementsLimits.gen1[element];
	}
	if (staked == null) return false;
	let ocurrences = new Set();
	staked.forEach(hatchy => {
		if (checkForShiny) {
			if (isShinyHatchy(hatchy)) {
				let k = hatchy.monsterId;
				if (!ocurrences.has(k)) ocurrences.add(k)
			}
		} else {
			if (gen == 2) {
				if (hatchy.commonQuantity && hatchy.commonQuantity > 0) { // check only common
					let k = hatchy.monsterId;
					if (!ocurrences.has(k)) ocurrences.add(k)
				}
			} else {
				let k = hatchy.monsterId;
				if (!ocurrences.has(k)) ocurrences.add(k)
			}
		}
	});
	//test
	//ocurrences = new Set([19,20,21,22, 23,24,25,26,27]);
	if (elementsLimitsGen)
		for (let i = elementsLimitsGen.min;
			i < elementsLimitsGen.max; i++) {
			if (!ocurrences.has(i)) return false;
		}
	return true;
}

export function countCompleteCollection(stakedHatchies: Metadata[] | null, gen?: number, checkForShiny?: boolean) {
	if (stakedHatchies == null) return 0

	const countsCollection: any = {}
	const countsShinyCollection: any = {}
	let ocurrences: any = new Set();


	if (checkForShiny) {
		for (const hatchy of stakedHatchies) {
			if (isShinyHatchy(hatchy)) {
				const id = hatchy.monsterId.toString()
				countsShinyCollection[id] = countsShinyCollection[id] ? countsShinyCollection[id] + 1 : 1
			}
		}
		if (gen == 1 && Object.values(countsShinyCollection).length >= 39) {
			ocurrences = new Set(Object.values(countsShinyCollection))
			return Math.min(...ocurrences)
		}
		if (gen == 2 && Object.values(countsShinyCollection).length >= 102) {
			ocurrences = new Set(Object.values(countsShinyCollection))
			return Math.min(...ocurrences)
		}
	} else {
		for (const hatchy of stakedHatchies) {
			const id = hatchy.monsterId.toString()
			countsCollection[id] = countsCollection[id] ? countsCollection[id] + 1 : 1
		}
		if (gen == 1 && Object.values(countsCollection).length >= 39) {
			ocurrences = new Set(Object.values(countsCollection))
			return Math.min(...ocurrences)
		}

		if (gen == 2 && Object.values(countsCollection).length >= 102) {
			ocurrences = new Set(Object.values(countsCollection))
			return Math.min(...ocurrences)
		}
	}

	return 0
}

export function countCelestion(hatchiesData: Metadata[]) {
	let countCelestion = 0
	hatchiesData.map(hatchy => {
		if (hatchy.monsterId == 0) countCelestion++
	})
	return countCelestion
}

export function countDragons(hatchies: Metadata[]) {

	let countCollection = 0
	const ids = [137, 138, 139, 140, 141, 142]

	for (const hatchy of hatchies) {
		const found = ids.find(id => id == hatchy.monsterId)
		if (found) countCollection++
	}
	return countCollection
}

export function countVoid(hatchies: Metadata[]) {
	const ids = [
		10011001,
		10100101,
		10101001,
		11111111
	]
	let countCollection = 0

	for (const hatchy of hatchies) {
		const found = ids.find(id => id == hatchy.monsterId)
		if (found) countCollection++
	}
	return countCollection
}

export function countGen2SpecialCollections(hatchies: Metadata[], type: string) {

	let ids: number[] = []
	let ocurrences: any = new Set();
	const countsCollection: any = {}

	if (type == 'v') ids = [10011001, 10100101, 10101001, 11111111]
	else if (type == 'd') ids = [137, 138, 139, 140, 141, 142]

	for (const hatchy of hatchies) {
		const id = hatchy.monsterId.toString()
		const found = ids.find(id => id == hatchy.monsterId)
		if (found) countsCollection[id] = countsCollection[id] ? countsCollection[id] + 1 : 1
	}
	if (Object.values(countsCollection).length >= ids.length) {
		ocurrences = new Set(Object.values(countsCollection))
		return Math.min(...ocurrences)
	}

	return 0

}