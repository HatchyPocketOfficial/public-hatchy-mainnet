import { useWeb3React } from "@web3-react/core";
import { BigNumber, ethers } from "ethers";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "react-toastify";
import useUserEggInfo from "../../hooks/gen2/useUserEggInfo";
import { BasicGen2Metadata } from "../../types";
import { getHatchyPocketEggsGen2Address } from "../../utils/addressHelpers";
import { mintEggs, hatchMultiple, approveTokens } from "../../utils/contracts";
import { displayError, displayWarn } from "../../utils/ErrorMessage";
import { useAccount } from "../AccountContext";
import { useWallet } from "../WalletContext";

const EggContext = createContext<{
    userSolarEggs: BigNumber
    userLunarEggs: BigNumber
    solarEggsAvailable: BigNumber
    lunarEggsAvailable: BigNumber
    eggPrice: BigNumber
    isApproved: boolean
    maxEggPerTx: BigNumber
    buyEggs: (eggType: number, amount: number) => Promise<any>
    hatchEggs:(eggType: number, amount: number) => Promise<any>
    approve: ()=> Promise<void>
    isProcessing: boolean
    updater: string
} | undefined>(undefined);

const EggContextProvider = ({ children }: {children: ReactNode}) => {
    const { account, provider: library, chainId } = useWeb3React();
    const { gen2Wallet, gen2Metadatas } = useWallet();
    const { userInfo } = useAccount();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [updater, setUpdater] = useState("");
    const [error, setError] = useState("");

    const {
        userSolarEggs,
        userLunarEggs,
        solarEggsAvailable,
        lunarEggsAvailable,
        eggPrice,
        isApproved,
        maxEggPerTx
    } = useUserEggInfo(updater, account);

    /*Refresh Function */
	const refreshEggs = () => {
		const date = new Date()
		setUpdater(date.toString());
	}

    const approve = async() => {
        setIsProcessing(true);
        try{
            if(account && library) {
                const { transactionHash, result, error } = await approveTokens(
                    account,
                    getHatchyPocketEggsGen2Address(),
                    library.getSigner()
                );
                if (result) {
                    toast.success("Approved successfully!");
                } else {
                    console.log("approve error:", error);
                    setError(error as string);
                    toast.error("Some issue!");
                }
                refreshEggs();
                setIsProcessing(false);
            }
        } catch (error) {
            console.log(error);
            setIsProcessing(false);
        }
        
    }

    const buyEggs = async (eggType: number, amount: number) => {
        if(!account || !library) {
            displayWarn("Connect your wallet!");
            return;
        }
        if(isProcessing) {
            displayWarn("something is still processing");
            return;
        }
        if(!isApproved) {
            approve();
            return;
        }
        if(amount > parseInt(maxEggPerTx.toString())) {
            displayError("You can buy 40 eggs max per transaction.");
            return;
        }

        setIsProcessing(true);

        try {
            let referrer = ethers.constants.AddressZero;
            
            if (userInfo && userInfo.referrer &&
                userInfo.referrer!="" && 
                userInfo.referrer.includes("0x")){
                console.log("referrer:", referrer);
                referrer = userInfo.referrer;      
            } 
                
            const { transactionHash, result, error } = await mintEggs(
                eggType,
                amount,
                account,
                library.getSigner(),
                referrer 
            );
            if (result) {
                refreshEggs();
                return {
                    success: true,
                    result
                }
            } else {
                return {
                    success: false,
                    error
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsProcessing(false);
        }
    }

    const hatchEggs = async (eggType: number, amount: number) => {
        if(!account || !library) {
            displayWarn("Connect your wallet!");
            return;
        }
        if(isProcessing) {
            displayWarn("something is still processing");
            return;
        }

        if(amount > 10) {
            displayError("You can hatch 10 eggs max per transaction.");
            return;
        }
        setIsProcessing(true);
        try {
            const { events, transactionHash, result, error } = await hatchMultiple(
                eggType,
                amount,
                account,
                library.getSigner()
            );
            
            if (result) {
                refreshEggs();
                const hatchiesData: BasicGen2Metadata[] = [];
                for (let i = 0; i < events.length-1; i++) {
                    const newHatchyData = events[i].args;
                    hatchiesData.push({
                        monsterId: newHatchyData[3].toNumber(),
                        quantity: newHatchyData[4].toNumber()
                    })
                }
                gen2Wallet.addNewHatchies(hatchiesData);
                return {
                    success: true,
                    result
                }
            } else {
                return {
                    success: false,
                    error
                }
            }

        } catch (error: any) {
            console.log(error.message);
        } finally {
			setIsProcessing(false);
        }
    }

    return <EggContext.Provider
            value = {{
                userSolarEggs,
                userLunarEggs,
                solarEggsAvailable,
                lunarEggsAvailable,
                eggPrice,
                isApproved,
                maxEggPerTx,
                buyEggs,
                hatchEggs,
                approve,
                isProcessing,
                updater
            }}>
                { children }
            </EggContext.Provider>
}

function useEgg() {
    const context = useContext(EggContext);
    if(context == undefined) {
        throw new Error("error in EggContext");
    }
    return context;
}

export { EggContext, EggContextProvider, useEgg }