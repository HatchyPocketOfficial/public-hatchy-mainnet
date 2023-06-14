import React, { useEffect, useState } from 'react'
import { useStakeGen2 } from '../../contexts/gen2/StakeGen2Context';
import { useStake } from '../../contexts/StakeContext';
import { useWallet } from '../../contexts/WalletContext';
import { Metadata, SetsInfo } from '../../types';
import { countCelestion, countCompleteCollection, countDragons, countVoid, countGen2SpecialCollections } from '../../utils/metadataArraysUtils';
import ElementalStakeInfo from './ElementalStakeInfo';
import StakingCollectionStats from './StakingCollectionStats';

interface TotalStakingBonusProps {
}
export default function TotalStakingBonus({ }: TotalStakingBonusProps) {
	const { gen } = useWallet();
	const [stakedHatchiesGen1, setStakedHatchiesGen1] = useState({});
	const [stakedHatchiesGen2, setStakedHatchiesGen2] = useState({});
	const [completeCollections, setCompleteCollections] = useState(0)
	const [completeShinyCollections, setCompleteShinyCollections] = useState(0)
	const [completeVoidCollection, setCompleteVoidCollection] = useState(0)
	const [dragonsCount, setDragonCount] = useState(0)
	const [completeDragonCollections, setCompleteDragonCollections] = useState(0)
	const [voidCount, setVoidCount] = useState(0)
	const [setsInfo, setSetsInfo] = useState<SetsInfo>();
	const [shinySetsInfo, setShinySetsInfo] = useState<SetsInfo>();

	const stakedHatchies: any = gen == 1 ? stakedHatchiesGen1 : stakedHatchiesGen2;

	/*Stake NFT Info */
	const {
		stakedMetadatas,
		userSetsInfo,
		userShinySetsInfo
	} = useStake();

	const {
		gen2StakedMetadatas,
		gen2UserSetsInfo,
		gen2UserShinySetsInfo,
	} = useStakeGen2();

	useEffect(() => {
		if (gen == 2) {
			if (gen2UserSetsInfo)
				setSetsInfo(gen2UserSetsInfo);
			if (gen2UserShinySetsInfo)
				setShinySetsInfo(gen2UserShinySetsInfo);
		}
	}, [stakedHatchies, gen])
	useEffect(() => {
		setStakedHatchiesGen1({})
		setStakedHatchiesGen2({})
		setCompleteCollections(0)
		setCompleteShinyCollections(0)
		setCompleteDragonCollections(0)
		setCompleteVoidCollection(0)
	}, [gen])

	useEffect(() => {
		if (stakedMetadatas && gen == 1) {
			setCompleteCollections(countCompleteCollection(stakedMetadatas, 1))
			setCompleteShinyCollections(countCompleteCollection(stakedMetadatas, 1, true))
			setCompleteVoidCollection(countCelestion(stakedMetadatas))
		}
		if (gen2StakedMetadatas && gen == 2) {
			const auxSet = Object.assign({}, shinySetsInfo)
			delete auxSet?.voids
			delete auxSet?.dragons
			if (gen2StakedMetadatas.length != 0) {
				setCompleteCollections(Math.min(...Object.values(setsInfo || {})))
				setCompleteShinyCollections(Math.min(...Object.values(auxSet || {})))
				setDragonCount(countDragons(gen2StakedMetadatas))
				setCompleteDragonCollections(shinySetsInfo?.dragons || 0)
				setVoidCount(countVoid(gen2StakedMetadatas))
				setCompleteVoidCollection(shinySetsInfo?.voids || 0)
			}
		}
	}, [stakedHatchies, gen])


	useEffect(() => {
		let plant: Metadata[] = [];
		let water: Metadata[] = [];
		let fire: Metadata[] = [];
		let dark: Metadata[] = [];
		let light: Metadata[] = [];
		let dragons: Metadata[] = [];
		let voids: Metadata[] = [];
		const stakedHatchiesAux = { plant, water, fire, dark, light, dragons, voids }
		if (gen2StakedMetadatas && gen2StakedMetadatas.length > 0) {
			for (let i = 0; i < gen2StakedMetadatas.length; i++) {
				const item = gen2StakedMetadatas[i];
				if (item.element === "Plant" && item.monsterId < 137) {
					plant.push(item);
				}
				if (item.element === 'Water' && item.monsterId < 137) {
					water.push(item);
				}
				if (item.element === 'Fire' && item.monsterId < 137) {
					fire.push(item);
				}
				if (item.element === 'Dark' && item.monsterId < 137) {
					dark.push(item);
				}
				if (item.element === 'Light' && item.monsterId < 137) {
					light.push(item);
				}
				if (item.monsterId >= 137 && item.monsterId <= 142) {
					dragons.push(item);
				}
				if (item.element === 'Void' && item.monsterId != 142) {
					voids.push(item)
				}
			}
			setStakedHatchiesGen2(stakedHatchiesAux)

		}
	}, [gen2StakedMetadatas, gen])

	useEffect(() => {
		let plant: Metadata[] = [];
		let water: Metadata[] = [];
		let fire: Metadata[] = [];
		let dark: Metadata[] = [];
		let light: Metadata[] = [];
		let first: Metadata[] = [];
		const stakedHatchiesAux = { plant, water, fire, dark, light }
		if (stakedMetadatas && stakedMetadatas.length > 0) {
			for (let i = 0; i < stakedMetadatas.length; i++) {
				const item = stakedMetadatas[i];
				if (item.element === "Plant") {
					plant.push(item);
				} else if (item.element === 'Water') {
					water.push(item);
				} else if (item.element === 'Fire') {
					fire.push(item);
				} else if (item.element === 'Dark') {
					dark.push(item);
				} else if (item.element === 'Light') {
					light.push(item);
				} else {
					first.push(item)
				}
			}
			setStakedHatchiesGen1(stakedHatchiesAux)

		}
	}, [stakedMetadatas, gen])


	if (stakedHatchies == null) return <>Loading</>
	return (
		<div className='flex flex-col w-full max-w-xl justify-center items-center'>
			<StakingCollectionStats
				completeCollections={gen == 1 ? (userSetsInfo.collections || 0) : completeCollections}
				completeShinyCollections={gen == 1 ? (userShinySetsInfo.collections || 0) : completeShinyCollections}
				completeVoidCollection={completeVoidCollection}
				dragonsCount={gen == 1 ? 0 : dragonsCount}
				completeDragonCollections={gen == 1 ? 0 : completeDragonCollections}
				voidCount={voidCount}
			/>
			<ElementalStakeInfo
				hatchies={stakedHatchies.plant}
				element='Plant'
				completeSetAmount={setsInfo?.plant}
				completeShinySetAmount={shinySetsInfo?.plant}
			/>
			{/*WATER*/}
			<ElementalStakeInfo
				hatchies={stakedHatchies.water}
				element='Water'
				completeSetAmount={setsInfo?.water}
				completeShinySetAmount={shinySetsInfo?.water}
			/>
			{/*FIRE*/}
			<ElementalStakeInfo
				hatchies={stakedHatchies.fire}
				element='Fire'
				completeSetAmount={setsInfo?.fire}
				completeShinySetAmount={shinySetsInfo?.fire}
			/>
			{/*LIGHT*/}
			<ElementalStakeInfo
				hatchies={stakedHatchies.light}
				element='Light'
				completeSetAmount={setsInfo?.light}
				completeShinySetAmount={shinySetsInfo?.light}
			/>
			{/*DARK*/}
			<ElementalStakeInfo
				hatchies={stakedHatchies.dark}
				element='Dark'
				completeSetAmount={setsInfo?.dark}
				completeShinySetAmount={shinySetsInfo?.dark}
			/>
			{gen == 2 &&
				<>
					{/*LIGHT*/}
					<ElementalStakeInfo
						hatchies={stakedHatchies.dragons}
						element='Dragon'
						completeSetAmount={0}
						completeShinySetAmount={shinySetsInfo ? shinySetsInfo.dragons : 0}
					/>
					{/*DARK*/}
					<ElementalStakeInfo
						hatchies={stakedHatchies.voids}
						element='Void'
						completeSetAmount={0}
						completeShinySetAmount={shinySetsInfo ? shinySetsInfo.voids : 0}
					/>
				</>}
		</div>
	)
}
