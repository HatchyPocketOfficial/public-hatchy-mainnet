import { useWeb3React } from '@web3-react/core';
import { Contract } from 'ethers'
import { useMemo } from 'react'
import { getHatchyPocketEggsGen2Address, getHatchyPocketGen2Address } from '../../utils/addressHelpers'

import { getContract } from '../../utils/contracts'
import ABI from '../../abi'

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
    const { provider: library, account } = useWeb3React()

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

export function useHatchyPocketEggsGen2Contract(withSignerIfPossible?: boolean) : Contract | null {
    return useContract(getHatchyPocketEggsGen2Address(), ABI.HatchyPocketEggsGen2, withSignerIfPossible);
}

export function useHatchyPocketGen2Contract(withSignerIfPossible?: boolean) : Contract | null {
    return useContract(getHatchyPocketGen2Address(), ABI.HatchyPocketGen2, withSignerIfPossible);
}



