import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import {BigNumber, ethers} from "ethers";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {STAKING_BASE_URL} from "../constants";
import useFetchMetadatas from "../hooks/useFetchMetadatas";
import useFetchStakeMetadatas from "../hooks/useFetchStakeMetadatas";
import useHatchyApproval from "../hooks/useHatchyApproval";
import useStakedUserInfo from "../hooks/useStakedUserInfo";
import {BatchStakeMetadata, Metadata, SetsInfo, StakedHatchies} from "../types";
import {approveHatchyNFT, batchStake, batchwithdraw, harvest} from "../utils/contracts";
import { displayError } from "../utils/ErrorMessage";
import { useAccount } from "./AccountContext";

const StakeContext = createContext<{
    communityWeeklyRewards: BigNumber
    totalStakedWeight: BigNumber
    tokenPerShare: BigNumber
    userStakeInfo: null
    userWeight: BigNumber
    userTotalWeight: BigNumber
    referralBonus: number
    userStakedNFTCount: BigNumber
    userStakedNFT: string[] | null
    pendingReward: number
    userWeeklyRewards: BigNumber
    userSetsInfo: SetsInfo
    userShinySetsInfo: SetsInfo
    userShinyCount: BigNumber
    stakedHatchies: StakedHatchies | null
    updater: string
    refreshStake: () => void
    hadaapproved: boolean
    approve: () => Promise <void>
    batchHatchyStake: (walletSelected: string[]) => Promise <void>
    batchHatchyUnstake: (tokenIds: string[]) => Promise <void>
    signTokens: (address: string, tokenIds: string[]) => Promise<void | any[][] | undefined>
    hatchyHarvest: () => Promise<void>
    isProcessing: boolean
    stakedMetadatas: Metadata[] | null
	totalStakedTokensGen1: number
	stakedShinyTokensGen1: number
	stakedCommonTokensGen1: number
} | undefined>(undefined);

const StakeContextProvider = ({children}: { children: ReactNode }) => {
    const {account, provider:library, isActive} = useWeb3React();
    const [updater, setUpdater] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const hadaapproved = useHatchyApproval(updater, 1);
    const [error, setError] = useState("");
    const { userInfo } = useAccount();
	const [totalStakedTokensGen1, setTotalTokens] = useState(0);
	const [stakedShinyTokensGen1, setShinyTokensQuantity] = useState(0);
	const [stakedCommonTokensGen1, setCommonTokensQuantity] = useState(0);
    /*Contract Data*/
    const {
        communityWeeklyRewards,
        totalStakedWeight,
        tokenPerShare,
        userStakeInfo,
        userWeight,
        userTotalWeight,
        referralBonus,
        userStakedNFTCount,
        userStakedNFT,
        pendingReward,
        userWeeklyRewards,
        userSetsInfo,
        userShinySetsInfo,
        userShinyCount
    } = useStakedUserInfo(updater, account);
    /*Metadata*/
    const stakedHatchies = useFetchStakeMetadatas(userStakedNFT);
    const stakedMetadatas = useFetchMetadatas(userStakedNFT);

    /*Refresh Function */
    const refreshStake = () => {
        const date = new Date()
        setUpdater(date.toString());
    }
    /*Approve Transaction */
    const approve = async () => {
        setIsProcessing(true);
        try {
            if (!account || !library) return;
            await approveHatchyNFT(account, library.getSigner());
            setIsProcessing(false);
            //refreshStake();
            setUpdater("approve success");
        } catch (error) {
            setIsProcessing(false);
            console.log(error);
            //toast.error("Approve error!");
        }
    };
    /*Multisig*/
    const signTokens = async (address: string, tokenIds: string[]) => {
        const curTimeStamp = +new Date();
        return await axios.post(
            `${STAKING_BASE_URL}/api/hatchy/signs`,
            {
                curTimeStamp: String(curTimeStamp),
                account: address,
                // rawSig,
                tokenIds,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(async (res) => {
            if (!res.data.success) {
                displayError("Backend Sign Issue!");
                return;
            }

            const batchNFTs: BatchStakeMetadata[] = res.data.tokens;

            const params = batchNFTs.map((item) => {
                const {
                    tokenId,
                    monsterId,
                    isShiny,
                    serial,
                    elementId,
                    signData,
                } = item;

                return [
                    tokenId,
                    monsterId,
                    isShiny,
                    serial,
                    elementId,
                    signData[0],
                    signData[1],
                    signData[2],
                ];
            });
            return params;
        }).catch(()=>{
            displayError("Backend Sign Issue! double check you own the tokens and they are formatted properly");
            return;
        })
    }

    /*Batch Hatchy Stake */
    const batchHatchyStake = async (walletSelected: string[]) => {
        //const walletSelected = getSelectedTokens();
        if (!account || !library) {
            toast.warn("Connect your wallet!");
            return;
        }

        if (isProcessing) return;

        if (!hadaapproved) {
            approve();
            return;
        }

        if (!walletSelected || walletSelected?.length === 0) {
            toast.warn("No Hatchy Selected!");
            return;
        }

        if (walletSelected?.length > 20) {
            toast.warn("Cannot Stake more than 20 hatchies at once");
            return;
        }

        try {
            setIsProcessing(true);
            let referral = ethers.constants.AddressZero;
            if (userInfo && userInfo.referrer &&
                userInfo.referrer!="" && 
                userInfo.referrer.includes("0x")) referral = userInfo.referrer;
            
            const curTimeStamp = +new Date();
            const tokenIds = walletSelected;
            // const signMessage = getSignMessage(curTimeStamp.toString(), account);
            // const rawSig = signMessage;
            return await axios.post(
                `${STAKING_BASE_URL}/api/hatchy/signs`,
                {
                    curTimeStamp: String(curTimeStamp),
                    account,
                    // rawSig,
                    tokenIds,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then(async (res) => {
                if (!res.data.success) {
                    setIsProcessing(false);
                    toast.error("Backend Sign Issue!");
                    return;
                }

                const batchNFTs: BatchStakeMetadata[] = res.data.tokens;

                const params = batchNFTs.map((item) => {
                    const {
                        tokenId,
                        monsterId,
                        isShiny,
                        serial,
                        elementId,
                        signData,
                    } = item;

                    return [
                        tokenId,
                        monsterId,
                        isShiny,
                        serial,
                        elementId,
                        signData[0],
                        signData[1],
                        signData[2],
                    ];
                });

                const {transactionHash, result, error} = await batchStake(
                    params,
                    account,
                    library.getSigner(),
                    referral
                );

                if (result) {
                    toast.success("Staked successfully!");
                    //setUpdater("batch stake success");
                    //refreshStake();
                } else {
                    console.log("stake error:", error);
                    setError(error as string);
                    toast.error("Some issue!");
                }
                setIsProcessing(false);
            })
            .catch((err) => {
                console.error("error", err);
                setIsProcessing(false);
            });
        } catch (error) {
            console.log(error);
            setIsProcessing(false);
        }
    };

    /*Batch Hatchy Unstake */
    const batchHatchyUnstake = async (tokenIds: string[]) => {
        if (!account || !library) {
            toast.warn("Connect your wallet!");
            return;
        }

        if (isProcessing) return;
        setIsProcessing(true);

        if (!tokenIds || tokenIds?.length === 0) {
            toast.warn("No Hatchy Selected!");
            return;
        }
        if (tokenIds?.length > 20) {
            toast.warn("Cannot Unstake more than 20 hatchies at once");
            return;
        }

        try {
            const {transactionHash, result, error} = await batchwithdraw(
                tokenIds,
                library.getSigner()
            );
            if (result) {
                toast.success("Withdrawn successfully!");
            } else {
                setError(error as string);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsProcessing(false);
            return;
        }
    };

    /** Harvest Hatchy */
    const hatchyHarvest = async () => {
        if (!account || !library) {
            toast.warn("Connect your wallet!");
            return;
        }

        if (isProcessing) return;

        try {
            setIsProcessing(true);
            const {transactionHash, result, error} = await harvest(
                account,
                library.getSigner()
            );

            if (result) {
                toast.success("Harvest successfully!");
                //setUpdater("harvest success");
            } else {
                setError((error as Error).toString());
            }
            refreshStake();
            setIsProcessing(false);
        } catch (error) {
            console.log(error);
            setIsProcessing(false);
        }
    };

	useEffect(() => {
		if (isActive) {
			refreshStake();	
		}
	}, [isActive, account])

	useEffect(() => {
		if (stakedMetadatas) {
			let commonAmount = 0;
			let shinyAmount = 0;
			stakedMetadatas.forEach(hatchy=>{
				if (hatchy.isShiny) {
					shinyAmount++;	
				} else {
					commonAmount++;
				}
			});
            setCommonTokensQuantity(commonAmount);
            setShinyTokensQuantity(shinyAmount);
            setTotalTokens(commonAmount+shinyAmount);
		}
	}, [stakedMetadatas])

    /*Assign Provider Value */
    return <StakeContext.Provider
        value={{
            communityWeeklyRewards,
            totalStakedWeight,
            tokenPerShare,
            userStakeInfo,
            userWeight,
            userTotalWeight,
		    totalStakedTokensGen1,
		    stakedShinyTokensGen1,
		    stakedCommonTokensGen1,
            referralBonus,
            userStakedNFTCount,
            userStakedNFT,
            pendingReward,
            userWeeklyRewards,
            userSetsInfo,
            userShinySetsInfo,
            userShinyCount,
            stakedHatchies,
            updater,
            refreshStake,
            hadaapproved,
            approve,
            batchHatchyStake,
            batchHatchyUnstake,
            signTokens,
            hatchyHarvest,
            isProcessing,
            stakedMetadatas,
        }}>
        {children}
    </StakeContext.Provider>
}

function useStake() {
    const context = useContext(StakeContext)
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}

export {StakeContext, StakeContextProvider, useStake}