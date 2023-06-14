
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import { mainChainId } from './useAuth'
import { useHatchyNFTContract } from './useHatchyContract'

export const useWalletUserInfo = (refresh: string) => {
	const { account, provider: library, chainId } = useActiveWeb3React()
	const hatchyNFTContract = useHatchyNFTContract()
	const [userWalletNFT, setUserWalletNFT] = useState(null)

	useEffect(() => {

		if (hatchyNFTContract && account && chainId === mainChainId) {
			const fetch = async () => {
				// let tempBalance = ethers.BigNumber.from('0')
				const userWalletNFTs = await hatchyNFTContract.tokensOfOwner(account)
				setUserWalletNFT(userWalletNFTs)
			}
			fetch()
		}
	}, [account, hatchyNFTContract, refresh])

	return userWalletNFT
}


export default useWalletUserInfo
