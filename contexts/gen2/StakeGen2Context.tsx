import { BigNumber, ethers } from "ethers";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import useHatchyApproval from "../../hooks/useHatchyApproval";
import useGen2StakedUserInfo from "../../hooks/gen2/useGen2StakedUserInfo";
import { Metadata, SelectedHatchiesAmount, SetsInfo } from "../../types";
import { approveHatchyNFT, approveTokens, batchStakeGen2, batchwithdrawGen2, harvest, sleep, tokenStakes, tokenWithdraws } from "../../utils/contracts";
import { useAccount } from "../AccountContext";
import { displayError, displaySuccess, displayWarn } from "../../utils/ErrorMessage";
import { useWallet } from "../WalletContext";
import { useWeb3React } from "@web3-react/core";
import { getHatchyPocketEggsGen2Address, getRewarderAddress, getStakerAddress } from "../../utils/addressHelpers";
import useHatchyTokenApproval from "../../hooks/useHatchyTokenApproval";
import { formatHatchyTokenToString } from "../../utils/numberFormatterHelper";

const StakeGen2Context = createContext<{
	gen2UserWeight: BigNumber
	gen2UserSetsInfo: SetsInfo
	gen2UserShinySetsInfo: SetsInfo
	gen2UserShinyCount: BigNumber
	updater: string
	refreshStakeGen2: () => void
	hadaapprovedGen2: boolean
	isTokenApproved: boolean
	batchHatchyStakeGen2: (walletSelected: string[]) => Promise<void>
	batchHatchyStakeGen2Amounts: (amountData: SelectedHatchiesAmount, stakeMode: boolean) => Promise<void>
	batchHatchyUnstakeGen2: (tokenIds: string[]) => Promise<void>
	hatchyHarvestGen2: () => void
	stakeSAmountHatchy: (stakeMode: boolean, amount: BigNumber) => Promise<void>
	approveGen2: () => Promise<void>
	approveTokenStaking: () => Promise<void>
	isProcessingGen2: boolean
	gen2StakedMetadatas: Metadata[] | undefined
	totalStakedTokensGen2: number
	stakedShinyTokensGen2: number
	stakedCommonTokensGen2: number
	stakedERC20: BigNumber
} | undefined>(undefined);

const StakeGen2ContextProvider = ({ children }: { children: ReactNode }) => {
	const { account, provider: library, chainId } = useWeb3React();
	const [updater, setUpdater] = useState("");
	const [isProcessingGen2, setIsProcessing] = useState(false);
	const hadaapprovedGen2 = useHatchyApproval(updater, 2);
	const isTokenApproved = useHatchyTokenApproval(updater);
	const [error, setError] = useState("");
	const { userInfo } = useAccount();
	const { gen2Metadatas, gen2Wallet } = useWallet();

	/*Contract Data*/
	const {
		gen2UserSetsInfo,
		gen2UserWeight,
		gen2UserShinySetsInfo,
		gen2UserShinyCount,
		gen2StakedMetadatas,
		totalTokens,
		shinyTokensQuantity,
		commonTokensQuantity,
		stakedERC20,
	} = useGen2StakedUserInfo(updater, account);

	/*Refresh Function */
	const refreshStakeGen2 = () => {
		const date = new Date()
		setUpdater(date.toString());
	}
	/*Approve Transaction */
	const approveGen2 = async () => {
		setIsProcessing(true);
		try {
			if (!account || !library) return;
			await approveHatchyNFT(account, library.getSigner(), 2);
			setIsProcessing(false);
			//refreshStake();
			const date = new Date()
			setUpdater(date.toString());
		} catch (error) {
			setIsProcessing(false);
			console.log(error);
			//toast.error("Approve error!");
		}
	};

	const approveTokenStaking = async () => {
		setIsProcessing(true);
		try {
			if (account && library) {
				const { transactionHash, result, error } = await approveTokens(
					account,
					getStakerAddress(2),
					library.getSigner()
				);
				if (result) {
					toast.success("Approved successfully!");
				} else {
					console.log("approve error:", error);
					setError(error as string);
					toast.error("Some issue!");
				}
				const date = new Date()
				setUpdater(date.toString());
				setIsProcessing(false);
			}
		} catch (error) {
			console.log(error);
			setIsProcessing(false);
		}

	}

	const getIdsAndAmounts = (amountsData: SelectedHatchiesAmount) => {
		const ids: number[] = [];
		const amounts: number[] = [];
		let count = 0;
		for (const key in amountsData) {
			if (Object.prototype.hasOwnProperty.call(amountsData, key)) {
				const amountData = amountsData[key];
				count += parseInt(amountData.commonAmount);
				count += parseInt(amountData.shinyAmount);
				/*if (count > 50) {
					displayWarn("Cannot Stake more than 50 hatchies at once");
					return { ids: null, amounts: null }
				}*/
				const id = amountData.monsterId;
				const shinyId = (id * 1000) + 888;
				// max quantity available
				const commonQuantity = parseInt(amountData.commonAmount);
				const shinyQuantity = parseInt(amountData.shinyAmount);
				if (id < 137) { // elemental set
					if (commonQuantity > 0) {
						ids.push(id);
						amounts.push(commonQuantity);
					}
					if (shinyQuantity > 0) {
						ids.push(shinyId);
						amounts.push(shinyQuantity);
					}
				} else if (id < 143) { // dragons
					if (shinyQuantity > 0) {
						ids.push(shinyId);
						amounts.push(shinyQuantity);
					}
				} else { // void
					if (shinyQuantity > 0) {
						ids.push(id);
						amounts.push(shinyQuantity);
					}
				}
			}
		}
		return { ids, amounts }
	}

	const batchHatchyStakeGen2Amounts = async (
		amountsData: SelectedHatchiesAmount,
		stakeMode?: boolean) => {
		if (!account || !library) {
			displayWarn("Connect your wallet!");
			return;
		}
		if (isProcessingGen2) return;
		if (!hadaapprovedGen2) {
			approveGen2();
			return;
		}
		if (!amountsData) {
			displayWarn("No Hatchy Selected!");
			return;
		}

		try {
			setIsProcessing(true);
			let referrer = ethers.constants.AddressZero;
			if (userInfo && userInfo.referrer &&
				userInfo.referrer != "" &&
				userInfo.referrer.includes("0x")) referrer = userInfo.referrer;
			const { ids, amounts } = getIdsAndAmounts(amountsData);
			if (ids == null || amounts == null) return;
			if (stakeMode) {
				const { transactionHash, result, error } = await batchStakeGen2(
					account,
					library.getSigner(),
					ids,
					amounts,
					referrer
				);

				if (result) {
					gen2Wallet.refreshWallet();
					refreshStakeGen2();
				} else {
					console.log("stake error:", error);
					setError(error as string);
				}
			} else {
				const { transactionHash, result, error } = await batchwithdrawGen2(
					library.getSigner(),
					ids,
					amounts
				);

				if (result) {
					gen2Wallet.refreshWallet();
					refreshStakeGen2();
				} else {
					console.log("unstake error:", error);
					setError(error as string);
				}
			}
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		} finally {
			setIsProcessing(false);
			return;
		}
	};

	const batchHatchyStakeGen2 = async (tokenIds: object) => {
		if (!account || !library) {
			toast.warn("Connect your wallet!");
			return;
		}

		if (isProcessingGen2) return;

		if (!hadaapprovedGen2) {
			approveGen2();
			return;
		}
		if (!tokenIds || Object.keys(tokenIds)?.length === 0) {
			toast.warn("No Hatchy Selected!");
			return;
		}

		/*if (Object.keys(tokenIds).length > 50) {
			toast.warn("Cannot Stake more than 50 hatchies at once");
			return;
		}*/

		try {
			setIsProcessing(true);
			let referrer = ethers.constants.AddressZero;
			if (userInfo && userInfo.referrer &&
				userInfo.referrer != "" &&
				userInfo.referrer.includes("0x")) referrer = userInfo.referrer;
			const ids: number[] = [];
			const amounts: number[] = [];
			for (let i = 0; i < Object.keys(tokenIds).length; i++) {
				const id = parseInt(Object.keys(tokenIds)[i])
				const hatchy = gen2Metadatas?.find(hatchy => hatchy.monsterId == id);

				const shinyId = (id * 1000) + 888
				const commonQuantity = hatchy?.commonQuantity;
				const shinyQuantity = hatchy?.shinyQuantity
				const amount = tokenIds[id as keyof object]

				if (id < 137) { // elemental set
					if (commonQuantity) {
						const isCommonComplet = commonQuantity - amount >= 0
						if (isCommonComplet) {
							ids.push(id);
							amounts.push(amount);
						} else {
							//push all common
							ids.push(id);
							amounts.push(commonQuantity);
							//push shiny remaining
							ids.push(shinyId);
							amounts.push(-(commonQuantity - amount));
						}
					} else if (shinyQuantity) {
						ids.push(shinyId);
						amounts.push(amount);
					}

				} else if (id < 143) { // dragons
					ids.push(shinyId);
					amounts.push(amount);
				} else { // void
					ids.push(id);
					amounts.push(amount);
				}
			}

			const { transactionHash, result, error } = await batchStakeGen2(
				account,
				library.getSigner(),
				ids,
				amounts,
				referrer
			);

			if (result) {
				displaySuccess("Staked successfully!");
			} else {
				console.log("stake error:", error);
				setError(error as string);
				displayError("Transaction error");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsProcessing(false);
			return;
		}
	};

	const batchHatchyUnstakeGen2 = async (tokenIds: string[]) => {
		if (!account || !library) {
			toast.warn("Connect your wallet!");
			return;
		}

		if (isProcessingGen2) return;

		if (!tokenIds || tokenIds?.length === 0) {
			toast.warn("No Hatchy Selected!");
			return;
		}

		if (tokenIds.length > 50) {
			toast.warn("Cannot Unstake more than 50 hatchies at once");
			return;
		}

		try {
			setIsProcessing(true);
			// calculate id and quantity
			const ids: number[] = [];
			const amounts: number[] = [];
			for (let i = 0; i < tokenIds.length; i++) {
				const id = parseInt(tokenIds[i]);
				const shinyId = (id * 1000) + 888;
				// max quantity available
				const hatchy = gen2StakedMetadatas?.find(hatchy => hatchy.monsterId == id);

				const commonQuantity = hatchy?.commonQuantity;
				const shinyQuantity = hatchy?.shinyQuantity;
				if (id < 137) { // elemental set
					if (commonQuantity) {
						ids.push(id);
						amounts.push(commonQuantity);
					}
					if (shinyQuantity) {
						ids.push(shinyId);
						amounts.push(shinyQuantity);
					}
				} else if (id < 143) { // dragons
					if (shinyQuantity) {
						ids.push(shinyId);
						amounts.push(shinyQuantity);
					}
				} else { // void
					if (shinyQuantity) {
						ids.push(id);
						amounts.push(shinyQuantity);
					}
				}
			}

			const { transactionHash, result, error } = await batchwithdrawGen2(
				library.getSigner(),
				ids,
				amounts
			);

			if (result) {
				displaySuccess("Withdrawn successfully!");
			} else {
				console.log("stake error:", error);
				setError(error as string);
				displayError("Transaction error");
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsProcessing(false);
			return;
		}
	};

	/** Harvest Hatchy */
	const hatchyHarvestGen2 = async () => {
		if (!account || !library) {
			toast.warn("Connect your wallet!");
			return;
		}

		if (isProcessingGen2) return;

		try {
			setIsProcessing(true);
			const { transactionHash, result, error } = await harvest(
				account,
				library.getSigner()
			);

			if (result) {
				toast.success("Harvest successfully!");
				//setUpdater("harvest success");
			} else {
				setError((error as Error).toString());
			}
			refreshStakeGen2();
			setIsProcessing(false);
		} catch (error) {
			console.log(error);
			setIsProcessing(false);
		}
	};

	const stakeSAmountHatchy = async (stakeMode: boolean, amount: BigNumber) => {
		if (!account || !library) {
			toast.warn("Connect your wallet!");
			return;
		}
		try {
			setIsProcessing(true);
			let referrer = ethers.constants.AddressZero;
			if (userInfo && userInfo.referrer &&
				userInfo.referrer != "" &&
				userInfo.referrer.includes("0x")) referrer = userInfo.referrer;
			console.log(amount);
			//let bigNumberAmount = BigNumber.from(amount * 100);
			//const pow = 16;
			//bigNumberAmount = bigNumberAmount.mul(BigNumber.from("10").pow(pow))
			if (stakeMode) {
				//setHatchyAmount(parseFloat(ethers.utils.formatEther(tokenBalance.toString())).toFixed(3));
				// console.log(`${amount}`);
				// console.log(`${bigNumberAmount}`);
				const { result, error } = await tokenStakes(
					account,
					library.getSigner(),
					amount,
					referrer);
				if (result) toast.success(`${formatHatchyTokenToString(amount)} staked succesfully`)
				else {
					toast.error(`Transaction failed`)
					setError((error as Error).toString());
				} 
			} else {
				const { result, error } = await tokenWithdraws(
					library.getSigner(),
					amount
				);
				if (result) toast.success(`${formatHatchyTokenToString(amount)} unstaked succesfully`)
				else{
					toast.error(`Transaction failed`)
					setError((error as Error).toString());
				} 
			}

		} catch (error) {
			console.log(error);
			setIsProcessing(false);
		} finally {
			setIsProcessing(false);
			return;
		}
	}

	/*Assign Provider Value */
	return <StakeGen2Context.Provider
		value={{
			gen2UserWeight,
			gen2UserSetsInfo,
			gen2UserShinySetsInfo,
			gen2UserShinyCount,
			updater,
			refreshStakeGen2,
			hadaapprovedGen2,
			isTokenApproved,
			approveGen2,
			approveTokenStaking,
			batchHatchyStakeGen2,
			batchHatchyStakeGen2Amounts,
			batchHatchyUnstakeGen2,
			hatchyHarvestGen2,
			stakeSAmountHatchy,
			//pushStakeToken,
			//removeStakeToken,
			//pushUnstakeToken,
			//removeUnstakeToken,
			isProcessingGen2,
			gen2StakedMetadatas,
			totalStakedTokensGen2: totalTokens,
			stakedShinyTokensGen2: shinyTokensQuantity,
			stakedCommonTokensGen2: commonTokensQuantity,
			stakedERC20
		}}>
		{children}
	</StakeGen2Context.Provider>
}

function useStakeGen2() {
	const context = useContext(StakeGen2Context)
	if (context === undefined) {
		throw new Error('useStakeGen2 must be used within a StakeGen2Provider')
	}
	return context
}

export { StakeGen2Context, StakeGen2ContextProvider, useStakeGen2 }