import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from "react";
import { DefaultChainID } from "../../constants";
import { getBigNumber } from "../../utils/numberFormatterHelper";
import { useHatchyPocketEggsGen2Contract, useTokenContract } from "./useGen2Contract";
import { getPockyAddress, getHatchyPocketEggsGen2Address } from '../../utils/addressHelpers'

export const useUserEggInfo = (refresh: string, account?: string | null) => {
	const { chainId } = useWeb3React();
	const eggContract = useHatchyPocketEggsGen2Contract();
	const tokenContract = useTokenContract(getPockyAddress());
	const [userSolarEggs, setUserSolarEggs] = useState(getBigNumber('0'));
	const [userLunarEggs, setUserLunarEggs] = useState(getBigNumber('0'));
	const [solarEggsAvailable, setSolarEggsAvailable] = useState(getBigNumber('0'));
	const [lunarEggsAvailable, setLunarEggsAvailable] = useState(getBigNumber('0'));
	const [eggPrice, setEggPrice] = useState(getBigNumber('0'));
	const [isApproved, setApproved] = useState(false);
	const [maxEggPerTx, setMaxEggPerTx] = useState(getBigNumber('0'));

	const fetch = async () => {
		if (eggContract == null) return;

		let _solarEggsAvailable = await eggContract.eggSupplies(0);
		_solarEggsAvailable = 249990 - parseInt(_solarEggsAvailable);
		setSolarEggsAvailable(_solarEggsAvailable);
		let _lunarEggsAvailable = await eggContract.eggSupplies(1);
		_lunarEggsAvailable = 249990 - parseInt(_lunarEggsAvailable);
		setLunarEggsAvailable(_lunarEggsAvailable);
		const _eggPrice = await eggContract.PRICE();
		setEggPrice(_eggPrice);
		let _maxEggPerTx = await eggContract.MAX_PER_TX();
		setMaxEggPerTx(_maxEggPerTx);

		if (account && tokenContract) {
			const _userSolarEggs = await eggContract.balanceOf(account, 0);
			setUserSolarEggs(_userSolarEggs);
			const _userLunarEggs = await eggContract.balanceOf(account, 1);
			setUserLunarEggs(_userLunarEggs);

			let allowance = await tokenContract.allowance(account, getHatchyPocketEggsGen2Address());

			if (allowance.gt(0)) {
				setApproved(true);
			} else {
				setApproved(false);
			}
		} else {
			setUserSolarEggs(getBigNumber('0'));
			setUserLunarEggs(getBigNumber('0'));
		}
	}

	useEffect(() => {
		if (eggContract && chainId === DefaultChainID) {
			fetch();
		}
	}, [account, eggContract, refresh])

	return { userSolarEggs, userLunarEggs, solarEggsAvailable, lunarEggsAvailable, eggPrice, isApproved, maxEggPerTx }
}

export default useUserEggInfo