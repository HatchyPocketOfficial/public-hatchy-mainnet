import { BigNumber, ContractInterface, ethers, Signer } from "ethers"
import {
	getMulticallAddress,
	getHatchyNFTAddress,
	getStakerAddress,
	getPockyAddress,
	getHatchyPocketEggsGen2Address,
	getHatchyPocketGen2Address, getRewarderAddress, getBatchTransferAddress, getUSDTAddress, getTokenSaleAddress
} from "./addressHelpers";
import ABI from "../abi";
import { JsonRpcSigner, Provider, Web3Provider } from "@ethersproject/providers";
import { zeroAddress } from "../constants";

export const simpleRpcProvider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_REACT_APP_NODE_1);

export const getContract = (address: string, abi: ContractInterface, signer: Web3Provider | Signer | Provider) => {
	// console.log('getContract: address,',address,abi,signer)
	const signerOrProvider = signer ? signer : simpleRpcProvider
	return new ethers.Contract(address, abi, signerOrProvider)
}

export const getMulticallContract = (provider: Provider) => {
	return getContract(getMulticallAddress(), ABI.Multicall, provider)
}

// Get NFT  Contract Instanse
export const getHatchyNFTContract = (provider: Signer | Provider, gen = 1) => {
	return getContract(
		getHatchyNFTAddress(gen),
		gen == 1 ? ABI.Hatchy : ABI.HatchyPocketGen2,
		provider
	);
};

export const getStakeContract = (provider: JsonRpcSigner, gen = 1) => {
	return getContract(
		getStakerAddress(gen),
		gen == 1 ? ABI.Staker : ABI.StakerGen2,
		provider
	);
};
export const getRewarderContract = (provider: JsonRpcSigner) => {
	return getContract(
		getRewarderAddress(),
		ABI.Rewarder,
		provider
	);
};

export const getPockyContract = (provider: Provider) => {
	return getContract(
		getPockyAddress(),
		ABI.Pocky,
		provider
	)
}

export const getTokenContract = (currency: string, provider: JsonRpcSigner) => {
	return getContract(
		currency,
		ABI.ERC20,
		provider
	)
}

export const getBatchTransferContract = (provider: JsonRpcSigner) => {
	return getContract(
		getBatchTransferAddress(),
		ABI.BatchTransferGen1,
		provider
	);
};

export const getTokenSaleContract = (provider: JsonRpcSigner) => {
	return getContract(
		getTokenSaleAddress(),
		ABI.TokenSale,
		provider
	);
}

export const getUSDTContract = (provider: JsonRpcSigner) => {
	return getContract(
		getUSDTAddress(),
		ABI.USDT,
		provider
	);
}

export const getSignMessage = (curTimeStamp: string, account: string) => {

	const signMessage = ethers.utils.defaultAbiCoder.encode(
		["string", "uint256", "string", "address"],
		[`time`, curTimeStamp, `address`, account]
	);

	return signMessage;

}

export const batchStake = async (
	params: any,
	account: string,
	provider: JsonRpcSigner,
	referral: string
) => {
	if (!account) {
		return {
			result: false,
			error: 'No account'
		}
	}
	let result = false;

	try {
		const approved = await isApprovedHatchyNFT(account, provider);
		if (!approved) {
			return {
				result,
				error: 'Please approve to stake'
			}
		}
		const stakeContract = getStakeContract(provider);
		const tx = await stakeContract.batchStake(params, referral);
		const receipt = await tx.wait(1);
		await sleep(3000);
		return {
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e) {
		console.log(e)
		return {
			result,
			error: e as Error
		}
	}
}

export const batchwithdraw = async (tokenIds: Array<string>, provider: JsonRpcSigner) => {
	// uint256 lockId, uint256 amount
	try {
		const stakeContract = getStakeContract(provider)
		const tx = await stakeContract.batchWithdraw(tokenIds)
		const receipt = await tx.wait(1);
		await sleep(3000);
		return {
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e) {
		console.log(e)
		return {
			result: false,
			error: e
		}
	}
}

export const harvest = async (account: string, provider: JsonRpcSigner) => {

	let result = false;

	if (!account) {
		return {
			result,
			error: 'No account'
		}
	}
	try {
		const rewarderContract = getRewarderContract(provider)
		const tx = await rewarderContract.harvest()
		const receipt = await tx.wait(1);
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
	}
}

export const isApprovedToken = async (spender: string, token: string, account: string, signer: JsonRpcSigner) => {
	if (token == zeroAddress) {
		return true;
	}
	// const factoryContract = getStakeContract(spender,signer);
	const tokenContract = getTokenContract(token, signer);

	try {
		const allowance = await tokenContract.allowance(account, spender);
		if (allowance.gt(0)) {
			return true;
		} else {
			return false
		}
	} catch (e) {
		console.log(e)
		return false;
	}
}

export const approveToken = async (staker: string, currency: string, account: string, signer: JsonRpcSigner) => {

	if (await isApprovedToken(staker, currency, account, signer)) {
		return true;
	}

	const stakeContract = getStakeContract(signer);
	const tokenContract = getTokenContract(currency, signer);

	try {
		const tx = await tokenContract.approve(stakeContract.address, ethers.constants.MaxUint256);
		await tx.wait(1)

		return true
	} catch (e) {
		console.log(e)
		return false;
	}

}

export const isApprovedHatchyNFT = async (account: string, signer: Signer | Provider, gen = 1) => {
	// const factoryContract = getStakeContract(spender,signer);
	const hatchyContract = getHatchyNFTContract(signer, gen);
	try {
		const allowed = await hatchyContract.isApprovedForAll(account, getStakerAddress(gen));
		return allowed;
	} catch (e) {
		console.log(e)
		return false;
	}
}

export const approveHatchyNFT = async (account: string, signer: Signer | Provider, gen = 1) => {
	if (await isApprovedHatchyNFT(account, signer, gen)) {
		return true;
	}
	const hatchyNFTContract = getHatchyNFTContract(signer, gen);
	const stakerAddress = getStakerAddress(gen);
	try {
		const tx = await hatchyNFTContract.setApprovalForAll(stakerAddress, true);
		await tx.wait(1)

		return true
	} catch (e) {
		console.log(e)
		return false;
	}
}
export const isApprovedBatchTransfer = async (account: string, signer: Signer | Provider) => {
	const hatchyContract = getHatchyNFTContract(signer, 1);
	try {
		const allowed = await hatchyContract.isApprovedForAll(account, getBatchTransferAddress());
		return allowed;
	} catch (e) {
		console.log(e)
		return false;
	}
}

export const approveBatchTransfer = async (account: string, signer: Signer | Provider) => {
	if (await isApprovedBatchTransfer(account, signer)) {
		return true;
	}
	const hatchyNFTContract = getHatchyNFTContract(signer);
	const batchTransferAddress = getBatchTransferAddress();
	try {
		const tx = await hatchyNFTContract.setApprovalForAll(batchTransferAddress, true);
		await tx.wait(1)
		return true
	} catch (e) {
		console.log(e)
		return false;
	}
}

// for gen2
export const getHatchyPocketEggsGen2Contract = (provider: Signer | Provider) => {
	return getContract(getHatchyPocketEggsGen2Address(), ABI.HatchyPocketEggsGen2, provider);
}

export const getHatchyPocketGen2Contract = (provider: Signer | Provider) => {
	return getContract(getHatchyPocketGen2Address(), ABI.HatchyPocketGen2, provider);
}

export const mintEggs = async (eggType: number, amount: number, account: string,
	provider: JsonRpcSigner, referral: string) => {
	let result = false;
	if (!account) {
		return {
			result,
			error: 'No account'
		}
	}
	try {
		const eggContract = getHatchyPocketEggsGen2Contract(provider);
		const tx = await eggContract.mintEgg(eggType, amount, referral);
		const receipt = await tx.wait(1);
		await sleep(3000);
		return {
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e) {
		return {
			result,
			error: e
		}
	}
}

export const hatchMultiple = async (eggType: number, amount: number, account: string, provider: JsonRpcSigner) => {
	let result = false;
	if (!account) {
		return {
			result,
			error: 'No account'
		}
	}
	try {
		const hatchContract = getHatchyPocketGen2Contract(provider);
		const tx = await hatchContract.hatchMultiple(eggType, amount, { gasLimit: 1500000 });
		const receipt = await tx.wait(1);
		return {
			events: receipt.events,
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e: any) {
		return {
			result,
			error: e.data.message
		}
	}
}

export const batchStakeGen2 = async (
	account: string,
	provider: JsonRpcSigner,
	ids: number[],
	quantity: number[],
	referral: string
) => {
	let result = false;
	if (!account) {
		return {
			result,
			error: 'No account'
		}
	}
	try {
		const approved = await isApprovedHatchyNFT(account, provider, 2);
		if (!approved) {
			return {
				result,
				error: 'Please approve to stake'
			}
		}
		const stakeContract = getStakeContract(provider, 2)

		// console.log(ids, quantity, referral);
		const tx = await stakeContract.batchStake(ids, quantity, referral);
		const receipt = await tx.wait(1);
		await sleep(4000);
		return {
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e) {
		console.log(e)
		return {
			result,
			error: e as Error
		}
	}
}

export const batchwithdrawGen2 = async (
	provider: JsonRpcSigner,
	ids: number[],
	quantity: number[]
) => {
	// uint256 lockId, uint256 amount
	try {
		const stakeContract = getStakeContract(provider, 2)
		const tx = await stakeContract.batchWithdraw(ids, quantity);
		const receipt = await tx.wait(1);
		await sleep(3000);
		return {
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e) {
		console.log(e)
		return {
			result: false,
			error: e
		}
	}
}

export const isApprovedTokens = async (account: string | null, spender: string, provider: JsonRpcSigner) => {
	const tokenContract = getTokenContract(getPockyAddress(), provider);
	try {
		const allowed = await tokenContract.isApprovedForAll(account, spender);
		return allowed;
	} catch (e) {
		console.log(e)
		return false;
	}
}
export const approveTokens = async (account: string | null, spender: string, provider: JsonRpcSigner) => {
	let result = false;
	if (!account) {
		return {
			result,
			error: 'No account'
		}
	}
	try {
		const tokenContract = getTokenContract(getPockyAddress(), provider);
		console.log(tokenContract.address,'approve', spender);
		const tx = await tokenContract.approve(spender, ethers.constants.MaxUint256);
		const receipt = await tx.wait(1);
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
	}
}

export const tokenStakes = async (
	account: string,
	provider: JsonRpcSigner,
	amount: BigNumber,
	referral: string
) => {
	let result = false;

	if (!account) {
		return {
			result,
			error: 'No account'
		}
	}
	try {
		const stakeContract = getStakeContract(provider, 2)
		const tx = await stakeContract.tokenStake(amount, referral);
		const receipt = await tx.wait(1);
		await sleep(3000);
		return {
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e) {
		console.log(e);
		return {
			result,
			error: e
		}
	}
}

export const tokenWithdraws = async (
	provider: JsonRpcSigner,
	amount: BigNumber,
) => {
	let result = false
	try {
		const stakeContract = getStakeContract(provider, 2)
		console.log(amount);
		const tx = await stakeContract.tokenWithdraw(amount);
		const receipt = await tx.wait(1);
		await sleep(3000);
		return {
			transactionHash: receipt.transactionHash,
			result: true,
			error: null
		}
	} catch (e: any) {
		return {
			result,
			error: e
		}
	}
}

// export const fetchStakedTokens = async (
// 	account: string,
// 	provider: JsonRpcSigner,
// ) => {
// 	let result = false;
// 	try {
// 		const stakeContract = getStakeContract(provider, 2)

// 		const userStakedTokens = await stakeContract.getStakedTokens(account)

// 	} catch (e) {

// 	}
// 	// "function getStakedTokens(address) view returns (uint256)",
// }

export const sleep = async (miliseconds: number) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve('');
		}, miliseconds);
	});
}


