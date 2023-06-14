import {useWeb3React } from "@web3-react/core";
import {BigNumber, Contract, ethers } from "ethers";
import {useState, useEffect} from "react";
import {toast } from "react-toastify";
import ABI from "../abi";
import {useWallet} from "../contexts/WalletContext";
import {getTokenSaleAddress} from "../utils/addressHelpers";
import {getTokenSaleContract, getUSDTContract} from "../utils/contracts";
import { formatHatchyTokenToInt } from "../utils/numberFormatterHelper";
import {mainChainId} from "./useAuth";

export default function useTokenSale(
) {
	const { account, chainId, provider } = useWeb3React();
	const [isTokenSaleApproved, setIsTokenSaleApproved] = useState(false);
	const [loading, setLoading] = useState(false);
	const [availableTokens, setAvailableTokens] = useState(BigNumber.from(0));
	const [claimableAmount, setClaimableAmount] = useState(BigNumber.from(0));
	const [soldAmount, setSoldAmount] = useState(BigNumber.from(0));
	const [active, setActive] = useState(false);

	const { refreshTokenBalance} = useWallet();

	useEffect(() => {
		fetchAllowance();
		fetchAvailable();
	}, [account])
	
	const fetchAllowance = async () =>{
		if (account && provider && chainId === mainChainId) {
			const usdtContract =  getUSDTContract(provider.getSigner());
			if (usdtContract) {
				let allowance = await usdtContract.allowance(account, getTokenSaleAddress());
				if (allowance.gt(0)) {
					setIsTokenSaleApproved(true);
				} else {
					setIsTokenSaleApproved(false);
				}
			}
		}
	}

	const fetchAvailable = async ()=>{
		try {
			if (account && provider && chainId === mainChainId) {
				const tokenSaleContractUnsigned = new Contract(getTokenSaleAddress(), ABI.TokenSale, provider?.getSigner());
				const available: BigNumber = await tokenSaleContractUnsigned.availableTokens();
				setAvailableTokens(available);

				const claimable: BigNumber = await tokenSaleContractUnsigned.claimable(account);
				setClaimableAmount(claimable);

				const sold: BigNumber = await tokenSaleContractUnsigned.sold();
				setSoldAmount(sold);

				const saleActive = await tokenSaleContractUnsigned.getSaleActive();
				setActive(saleActive);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const approveTokenSale = async ()=> {
		if (account && provider) {
			let result = false;
			if (!account) {
				return {
					result,
					error: 'No account'
				}
			}
			setLoading(true);
			try {
				const usdtContract =  getUSDTContract(provider.getSigner());
				console.log(usdtContract.address);
				
				const tx = await usdtContract.approve(getTokenSaleAddress(), ethers.constants.MaxUint256);
				const receipt = await tx.wait(1);
				await fetchAllowance();
				return {
					transactionHash: receipt.transactionHash,
					result: true,
					error: null
				}
			} catch (e) {
				console.log(e)
				return {
					result,
					error: e
				}
			} finally{
				setLoading(false);	
			}
		}
	}

	const buyTokens = async (
		amount: number
	)=>{
		if (account && provider) {
			let result = false;
			if (!account) {
				return {
					result,
					error: 'No account'
				}
			}
			setLoading(true);
			try {
				const usdtContract =  getUSDTContract(provider.getSigner());
				const tokenSaleContract =  getTokenSaleContract(provider.getSigner());
				const tokenBalance = await tokenSaleContract.availableTokens();
				if (amount>tokenBalance) {
					toast.error(`There are not enough $HATCHY tokens`);		
					return {
						result,
						error: null
					}
				}
				const usdtBalance = await usdtContract.balanceOf(account);
				if (BigNumber.from(amount*1000).gt(usdtBalance)) {
					toast.error(`You don't have enough USDT`);		
					return {
						result,
						error: null
					}
				}
				
				const tx = await tokenSaleContract.buyHatchy(amount);
				const receipt = await tx.wait(1);
				await fetchAvailable();
				refreshTokenBalance();
				toast.success(`${amount} $HATCHY purchased succesfully`);
				return {
					transactionHash: receipt.transactionHash,
					result: true,
					error: null
				}
			} catch (e) {
				console.log(e)
				return {
					result,
					error: e
				}
			} finally{
				setLoading(false);	
			}
		}
	}

	const claimTokens = async ()=>{
		if (account && provider) {
			let result = false;
			if (!account) {
				return {
					result,
					error: 'No account'
				}
			}
			setLoading(true);
			try {
				const tokenSaleContract =  getTokenSaleContract(provider.getSigner());
				const claimable: BigNumber = await tokenSaleContract.claimable(account);
				const tx = await tokenSaleContract.claimHatchy();
				const receipt = await tx.wait(1);
				await fetchAvailable();
				refreshTokenBalance();
				toast.success(`${formatHatchyTokenToInt(claimable)} $HATCHY claimed!`);
				return {
					transactionHash: receipt.transactionHash,
					result: true,
					error: null
				}
			} catch (e) {
				console.log(e)
				return {
					result,
					error: e
				}
			} finally{
				setLoading(false);	
			}
		}
	}

	return {
		buyTokens,
		claimTokens,
		approveTokenSale,
		isTokenSaleApproved,
		availableTokens,
		claimableAmount,
		soldAmount,
		active,
		loading
	}
}

