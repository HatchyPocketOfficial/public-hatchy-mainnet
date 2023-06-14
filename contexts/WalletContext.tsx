import { useWeb3React } from "@web3-react/core";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import ABI from "../abi";
import useContract from "../hooks/useContract";
import useFetchNFTMetadatas from "../hooks/useFetchNFTMetadatas";
import { BasicGen2Metadata, Metadata } from "../types";
import { getHatchyNFTAddress, getHatchyPocketGen2Address, getPockyAddress } from "../utils/addressHelpers";
import useTokenBalance from '../hooks/useTokenBalance';
import { BigNumber } from "ethers";
import useFetchGen2NFTMetadatas from "../hooks/gen2/useFetchGen2NFTMetadatas";
import { DefaultChainID } from "../constants";

const WalletContext = createContext<{
	loadingMetadatas: boolean
	metadatas: Metadata[] | null
	tokens: string[] | null
	totalTokensGen1: number
	shinyTokensGen1: number
	commonTokensGen1: number
	refreshWallet: () => void
	gen2Metadatas: Metadata[] | null
	gen2Wallet: {
		loadingMetadatas: boolean
		totalTokens: number
		shinyTokensQuantity: number
		commonTokensQuantity: number
		metadatas: Metadata[] | null
		newMetadatas: Metadata[] | null
		refreshWallet: () => Promise<void>
		addNewHatchies: (hatchiesData: BasicGen2Metadata[]) => void
	},
	tokenBalance: BigNumber
	refreshTokenBalance: () => void
	gen: number
	setGen: (gen: number) => void
	splashScreenLoaded: boolean
	setSplashScreenLoaded: (b: boolean)=>void
} | undefined>(undefined);

const WalletContextProvider = ({ children }: { children: ReactNode }) => {
	const [splashScreenLoaded, setSplashScreenLoaded] = useState(false);
	const {isActive, chainId} = useWeb3React();
	const [gen, setGen] = useState(1);
	/*NFT Contract */
	const { account } = useWeb3React();
	const [updater, setUpdater] = useState("");
	const [totalTokensGen1, setTotalTokens] = useState(0);
	const [shinyTokensGen1, setShinyTokensQuantity] = useState(0);
	const [commonTokensGen1, setCommonTokensQuantity] = useState(0);

	const hatchyContract = useContract(getHatchyNFTAddress(), ABI.Hatchy);
	const hatchyGen2Contract = useContract(getHatchyPocketGen2Address(), ABI.HatchyPocketGen2);
	const tokenBalance = useTokenBalance(getPockyAddress(), updater);

	const refreshTokenBalance = () => {
		const date = new Date()
		setUpdater(date.toString());
	}

	/*Fetch Metadata */
	let { loadingMetadatas, metadatas, tokens, refreshWallet } = useFetchNFTMetadatas(hatchyContract, account);
	/* Gen2 */
	let gen2Wallet = useFetchGen2NFTMetadatas(hatchyGen2Contract, account);

	useEffect(() => {
		if (metadatas) {
			let commonAmount = 0;
			let shinyAmount = 0;
			metadatas.forEach(hatchy=>{
				if (hatchy.isShiny) {
					shinyAmount++;	
				} else {
					commonAmount++;
				}
			});
			setCommonTokensQuantity(commonAmount);
			setShinyTokensQuantity(shinyAmount);
			setTotalTokens(shinyAmount+commonAmount);
		}
	}, [metadatas])
	
	useEffect(() => {
		if (chainId !=DefaultChainID) return;
		if (isActive) {
			refreshWallet();	
		}
	}, [isActive, account, chainId])
	

	/*Assign Provider Value */
	return <WalletContext.Provider value={{
		loadingMetadatas,
		metadatas,
		gen2Metadatas: gen2Wallet.metadatas,
		tokens,
		totalTokensGen1,
		shinyTokensGen1,
		commonTokensGen1,
		refreshWallet,
		gen2Wallet,
		tokenBalance,
		refreshTokenBalance,
		gen,
		setGen,
		splashScreenLoaded,
		setSplashScreenLoaded,
	}}>
		{children}
	</WalletContext.Provider>
}

function useWallet() {
	const context = useContext(WalletContext)
	if (context === undefined) {
		throw new Error('useWallet must be used within a WalletProvider')
	}
	return context
}

export { WalletContext, WalletContextProvider, useWallet }