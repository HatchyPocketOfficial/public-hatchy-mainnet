import {useEffect, useState } from 'react'
import {useActiveWeb3React } from '.'
import {getStakerAddress} from '../utils/addressHelpers'

import {mainChainId } from './useAuth'
import {useHatchyNFTContract} from './useHatchyContract'

const useHatchyApproval = (refresh: any, gen=1) => {
	const { account, chainId } = useActiveWeb3React()
	const hatchyContract = useHatchyNFTContract(false, gen);
	const [approved, setApproved] = useState(false)

	useEffect(() => {
		if (hatchyContract) {
			const fetch = async () => {
				try {
					const allowed = await hatchyContract.isApprovedForAll(account, getStakerAddress(gen));
					setApproved(allowed)
				} catch (error) {
					console.log(error);
				}
			}
			if (account && chainId === mainChainId) {
				fetch()
			}
		}
	}, [account, refresh])
	return approved
}

export default useHatchyApproval
