import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Metadata } from "../types";
import { useStakeGen2 } from "./gen2/StakeGen2Context";
import { useStake } from "./StakeContext";
import { useWallet } from "./WalletContext";

const StakeTokensContext = createContext<{
	handleStakeAndUnstake: () => Promise<void>
	stakeTokens: string[],
	setStakeTokens: React.Dispatch<React.SetStateAction<string[]>>
	unstakeTokens: string[],
	setUnstakeTokens: React.Dispatch<React.SetStateAction<string[]>>
	cancelAll: VoidFunction
	toggleSelectAllStake: (arr: Metadata[] | undefined) => void
	toggleSelectAllUnstake: (arr: Metadata[] | undefined) => void
	allSelectedStake: boolean
	setAllSelectedStake: (s: boolean) => void
	allSelectedUnstake: boolean
	setAllSelectedUnstake: (s: boolean) => void
	addStakeTokens: (idsArray?: number[]) => void
	addUnstakeTokens: (idsArray?: number[]) => void
} | undefined>(undefined);

const StakeTokensContextProvider = ({ children }: { children: ReactNode }) => {
	const [allSelectedStake, setAllSelectedStake] = useState(false);
	const [allSelectedUnstake, setAllSelectedUnstake] = useState(false);
	const [unstakeTokens, setUnstakeTokens] = useState<string[]>([]);
	const [stakeTokens, setStakeTokens] = useState<string[]>([]);
	const [countIDs, setCountIDs] = useState<any>({})

	const {
		refreshWallet,
		gen,
		gen2Wallet,
		gen2Metadatas
	} = useWallet();
	// Stake Gen 1
	const {
		batchHatchyUnstake,
		batchHatchyStake,
		refreshStake,
		hadaapproved,
		isProcessing
	} = useStake();

	// Stake Gen 2
	const {
		hadaapprovedGen2,
		batchHatchyStakeGen2,
		batchHatchyUnstakeGen2,
		refreshStakeGen2,
		approveGen2,
		isProcessingGen2,
	} = useStakeGen2();

	/*Stack all items that are not staked*/
	const toggleSelectAllStake = (hatchiesArray?: Metadata[]) => {
		if (allSelectedStake) {
			setStakeTokens([]);
			setAllSelectedStake(false);
		} else {
			const newStakeTokens = [...stakeTokens];
			hatchiesArray?.forEach(walletHatchy => {
				const id = gen == 1 ? walletHatchy.tokenId : walletHatchy.monsterId;
				if (id && !stakeTokens.includes(id.toString())) {
					newStakeTokens.push(id.toString());
				}
			})
			setStakeTokens(newStakeTokens);
			setAllSelectedStake(true);
		}
	}
	const toggleSelectAllUnstake = (hatchiesArray?: Metadata[]) => {
		if (allSelectedUnstake) {
			setUnstakeTokens([]);
			setAllSelectedUnstake(false);
		} else {
			const newUnstakeTokens = [...unstakeTokens];
			hatchiesArray?.forEach(walletHatchy => {
				const id = gen == 1 ? walletHatchy.tokenId : walletHatchy.monsterId;
				if (id && !newUnstakeTokens.includes(id.toString())) {
					newUnstakeTokens.push(id.toString());
				}
			})
			setUnstakeTokens(newUnstakeTokens);
			setAllSelectedUnstake(true);
		}
	}

	const addStakeTokens = (idsArray?: number[]) => {
		if (idsArray == null) return;
		if (gen == 1 && !hadaapproved) return;
		if (gen == 2 && !hadaapprovedGen2) return;
		if (gen2Metadatas == null) return;
		const commons: string[] = [];
		let newStakeTokens = [...stakeTokens];
		if (gen == 1) {
			idsArray.forEach(id => {
				const strId = id.toString();
				if (stakeTokens.includes(strId)) {
					commons.push(strId);
				}
			});
			idsArray.forEach(id => {
				if (stakeTokens.indexOf(id.toString()) === -1) {
					newStakeTokens.push(id.toString());
				}
			});
			newStakeTokens = newStakeTokens.filter(id => {
				return !commons.includes(id);
			});
		} else {
			idsArray.forEach(id => {
				countIDs[id.toString()] = (countIDs[id.toString()] || 0) + 1
				const hatchy = gen2Metadatas.find(hatchy => hatchy.monsterId == id);
				if (hatchy && hatchy.quantity && countIDs[id.toString()] <= hatchy.quantity) {
					newStakeTokens.push(id.toString());
				} else {
					countIDs[id.toString()] = hatchy?.quantity
				}
			})
		}
		setStakeTokens(newStakeTokens);
	}

	const addUnstakeTokens = (idsArray?: number[]) => {
		if (idsArray == null) return;
		if (gen == 1 && !hadaapproved) return;
		if (gen == 2 && !hadaapprovedGen2) return;
		const commons: string[] = [];
		idsArray.forEach(id => {
			const strId = id.toString();
			if (stakeTokens.includes(strId)) {
				commons.push(strId);
			}
		});
		let newStakeTokens = [...stakeTokens];
		idsArray.forEach(id => {
			if (stakeTokens.indexOf(id.toString()) === -1) {
				newStakeTokens.push(id.toString());
			}
		});
		newStakeTokens = newStakeTokens.filter(id => {
			return !commons.includes(id);
		});
		setStakeTokens(newStakeTokens);
	}

	const handleStakeAndUnstake = async () => {
		const stake = stakeTokens.length > 0;
		const unstake = unstakeTokens.length > 0;
		if (gen === 1) {
			if (stake && !unstake) await batchHatchyStake(stakeTokens);
			if (unstake && !stake) await batchHatchyUnstake(unstakeTokens);
			if (stake && unstake) {
				batchHatchyStake(stakeTokens);
				await batchHatchyUnstake(unstakeTokens);
			}
			// approve
			if (!stake && !unstake) await batchHatchyStake([]);
			refreshStake();
			refreshWallet();
		} else {
			if (stake && !unstake) await batchHatchyStakeGen2(countIDs);
			if (unstake && !stake) await batchHatchyUnstakeGen2(unstakeTokens);
			if (stake && unstake) {
				batchHatchyStakeGen2(stakeTokens);
				await batchHatchyUnstakeGen2(unstakeTokens);
			}
			// approve
			if (!stake && !unstake) await approveGen2();
			refreshStakeGen2();
			gen2Wallet.refreshWallet();
		}
	}

	const cancelAll = () => {
		setUnstakeTokens([]);
		setStakeTokens([]);
		setCountIDs({})
		setAllSelectedStake(false);
		setAllSelectedUnstake(false);
	}

	useEffect(() => {
		if (!isProcessing) {
			cancelAll();
		}
	}, [isProcessing]);

	useEffect(() => {
		if (!isProcessingGen2) {
			cancelAll();
		}
	}, [isProcessingGen2]);

	useEffect(() => {
		cancelAll();
	}, [gen]);

	return <StakeTokensContext.Provider
		value={{
			allSelectedStake,
			setAllSelectedStake,
			allSelectedUnstake,
			setAllSelectedUnstake,
			toggleSelectAllStake,
			toggleSelectAllUnstake,
			handleStakeAndUnstake,
			stakeTokens,
			setStakeTokens,
			unstakeTokens,
			setUnstakeTokens,
			cancelAll,
			addStakeTokens,
			addUnstakeTokens
		}}>
		{children}
	</StakeTokensContext.Provider>
}

function useStakeTokens() {
	const context = useContext(StakeTokensContext)
	if (context === undefined) {
		throw new Error('useStakeTokens must be used within a StakeTokensProvider')
	}
	return context
}

export { StakeTokensContext, StakeTokensContextProvider, useStakeTokens }