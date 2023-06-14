import {useEffect, useState } from 'react'
import {useActiveWeb3React } from '.'
import {getPockyAddress, getStakerAddress} from '../utils/addressHelpers'
import {mainChainId } from './useAuth'
import {useTokenContract} from './useHatchyContract'

const useHatchyTokenApproval = (refresh: any, gen=2) => {
	const { account, chainId } = useActiveWeb3React()
	const tokenContract = useTokenContract(getPockyAddress());
	const [approved, setApproved] = useState(false)

	useEffect(() => {
		if (tokenContract) {
			const fetch = async () => {
				try {
					let allowance = await tokenContract.allowance(account, getStakerAddress(gen));
					if (allowance.gt(0)) {
						setApproved(true);
					} else {
						setApproved(false);
					}
				} catch (error) {
					console.log(error);
				}
			}
			if (account && chainId === mainChainId) {
				fetch()
			}
		}
	}, [account, refresh])
	return approved;
}

export default useHatchyTokenApproval;
