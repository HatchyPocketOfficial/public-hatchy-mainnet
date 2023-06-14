import { Contract } from 'ethers'
import { useMemo } from 'react'
import { getHatchyNFTAddress, getRewarderAddress, getStakerAddress, getPockyAddress } from '../utils/addressHelpers'

import { getContract } from '../utils/contracts'
import { useActiveWeb3React } from './index'
import ABI from '../abi'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
    const { provider: library, account } = useActiveWeb3React()

    return useMemo(() => {
        if (!address || !ABI || !library) return null
        try {
            return getContract(address, ABI, library)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
    return useContract(tokenAddress, ABI.ERC20, withSignerIfPossible)
}

export function useHatchyTokenContract(withSignerIfPossible?: boolean): Contract | null {
    return useContract(getPockyAddress(), ABI.Pocky, withSignerIfPossible)
}

export function useStakeContract(withSignerIfPossible?: boolean): Contract | null {
    return useContract(getStakerAddress(), ABI.Staker, withSignerIfPossible)
}
export function useGen2StakeContract(withSignerIfPossible?: boolean): Contract | null {
    return useContract(getStakerAddress(2), ABI.StakerGen2, withSignerIfPossible)
}

export function useRewarderContract(withSignerIfPossible?: boolean): Contract | null {
    return useContract(getRewarderAddress(), ABI.Rewarder, withSignerIfPossible)
}

export function useHatchyNFTContract(withSignerIfPossible?: boolean, gen = 1): Contract | null {
    return useContract(getHatchyNFTAddress(gen), gen == 1 ? ABI.Hatchy : ABI.HatchyPocketGen2, withSignerIfPossible)
}



