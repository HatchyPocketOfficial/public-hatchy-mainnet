import { ethers } from 'ethers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'

export const NetworkContextName = 'NETWORK'
export const connectorLocalStorageKey = "hatchy_staker";

export function useActiveWeb3React() {
	const context = useWeb3ReactCore<ethers.providers.Web3Provider>()
	return context
}