import { BigNumber, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import { DefaultChainID } from '../constants'
import { SetsInfo } from '../types'
import { getBigNumber } from '../utils/numberFormatterHelper'
import { useRewarderContract, useStakeContract } from './useHatchyContract'

export const useStakedUserInfo = (refresh: string, account?: string | null) => {

	const { chainId } = useActiveWeb3React()
	const stakeContract = useStakeContract()
	const rewarderContract = useRewarderContract()

	const [communityWeeklyRewards, setCommunityWeeklyRewards] = useState(getBigNumber('0'))
	const [totalStakedWeight, setTotalStaked] = useState(getBigNumber('0'))
	const [userWeeklyRewards, setUserWeeklyRewards] = useState(getBigNumber('0'))
	const [userStakeInfo, setUserStakeInfo] = useState(null)
	const [userStakedNFT, setUserStakedNFT] = useState<Array<string> | null>(null)
	const [userStakedNFTCount, setUserStakedNFTCount] = useState(getBigNumber('0'))
	const [userSetsInfo, setUserSetsInfo] = useState<SetsInfo>({
		total: 0,
		plant: 0,
		water: 0,
		fire: 0,
		light: 0,
		dark: 0,
	})
	const [userShinySetsInfo, setUserShinySetsInfo] = useState<SetsInfo>({
		total: 0,
		plant: 0,
		water: 0,
		fire: 0,
		light: 0,
		dark: 0,
		voids: 0
	})
	const [userTotalWeight, setUserTotalWeight] = useState(getBigNumber('0'))
	const [userWeight, setUserWeight] = useState(getBigNumber('0'))
	const [userShinyCount, setUserShinyCount] = useState(getBigNumber('0'))
	const [tokenPerShare, setTokenPerShare] = useState(getBigNumber('0'))
	const [pendingReward, setPendingReward] = useState(0)
	const [referralBonus, setReferralBonus] = useState(0);
	const updateInterval = 30 * 1000;

	const fetch = async () => {
		if (stakeContract == null) return;
		if (rewarderContract == null) return;
		if (account == null || !ethers.utils.isAddress(account)) return;
		const referralBonus = await rewarderContract.getUserReferralBonus(account);
		setReferralBonus(referralBonus.toNumber());

		// let tempBalance = ethers.BigNumber.from('0')
		const rewardPerWeek = await rewarderContract.rewardPerWeek()
		setCommunityWeeklyRewards(rewardPerWeek)

		const totalStakedWeight = await rewarderContract.totalWeight()
		setTotalStaked(totalStakedWeight)

		if (account) {
			const userStakedNFTCountNew = await stakeContract?.userStakedNFTCount(account)
			setUserStakedNFTCount(userStakedNFTCountNew)

			const userStakedNFT: Array<BigNumber> = await stakeContract.userStakedNFT(account)
			/**Format */
			const formattedStakedNFT = userStakedNFT.map(token => token.toString()).reverse();
			setUserStakedNFT(formattedStakedNFT)

			// const userStakeInfo = await stakeContract.userStakeInfo(account)
			// //console.log('userStakeInfo:',userStakeInfo)
			// setUserStakeInfo(userStakeInfo)

			const userShinySetInfoFetch = await stakeContract.checkShinySetInfo(account)
			const formattedShinySetInfo = {
				...userShinySetsInfo,
				total: userShinySetInfoFetch[0].toNumber(),
				collections: userShinySetInfoFetch[1].toNumber(),
			}
			setUserShinySetsInfo(formattedShinySetInfo)

			const userSetInfo = await stakeContract.checkSetInfo(account)
			const formattedSetInfo = {
				...userSetsInfo,
				total: userSetInfo[0].toNumber()-(userShinySetInfoFetch[1].toNumber()),
				collections: userSetInfo[1].toNumber()-(userShinySetInfoFetch[1].toNumber()),
			}
			setUserSetsInfo(formattedSetInfo)

			const userStakedWeight = await stakeContract.calculateWeight(account)
			//console.log('userStakedWeight:', userStakedWeight[0].toNumber())
			setUserWeight(userStakedWeight[0])

			setUserShinyCount(userStakedWeight[1])

			const pendingReward = await rewarderContract.pendingReward(account)
			setPendingReward(parseInt(pendingReward?.toString()) / 1e18)
			//console.log('pendingReward:', (parseInt(pendingReward?.toString()) / 1e18).toFixed(3))
			
			// calculate user weekly rewards
			const userRewardInfo = await rewarderContract.userInfo(account);
			const accTokenPerShare = await rewarderContract.accTokenPerShare();
			const PRECISION_FACTOR = await rewarderContract.PRECISION_FACTOR();
			const userRewardWeight = userRewardInfo[0];
			const userRewardDebt = userRewardInfo[3];
			
			const hatchyReward = rewardPerWeek;
	
			const adjustedTokenPerShare = accTokenPerShare.add(
					hatchyReward.mul(PRECISION_FACTOR).div(totalStakedWeight)
			);
			//const _userWeeklyRewards = userRewardWeight.mul(adjustedTokenPerShare).div(PRECISION_FACTOR).sub(userRewardDebt);
			const _userWeeklyRewards = userRewardWeight.mul(hatchyReward).div(totalStakedWeight);
			
			setTokenPerShare(adjustedTokenPerShare.div(PRECISION_FACTOR));
			setUserWeeklyRewards(_userWeeklyRewards);
			setUserTotalWeight(userRewardWeight);
		}
	}
	useEffect(() => {
		const intervalUpdateInfo = setInterval(() => {
			if (stakeContract && chainId === DefaultChainID) fetch();
		}, updateInterval);
		return () => clearInterval(intervalUpdateInfo);
	}, [])

	useEffect(() => {
		if (stakeContract && chainId === DefaultChainID) {
			fetch()
		}
	}, [account, stakeContract, refresh])

	return {
		communityWeeklyRewards,
		totalStakedWeight,
		tokenPerShare,
		userWeeklyRewards,
		userStakeInfo,
		userWeight,
		userTotalWeight,
		referralBonus,
		userStakedNFTCount,
		userStakedNFT,
		pendingReward,
		userSetsInfo,
		userShinySetsInfo,
		userShinyCount
	}
}


export default useStakedUserInfo
