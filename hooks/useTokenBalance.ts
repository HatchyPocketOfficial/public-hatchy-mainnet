
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { useActiveWeb3React } from '.'
import { DefaultChainID, zeroAddress } from '../constants'
import { getBigNumber } from '../utils/numberFormatterHelper'
import { useTokenContract } from './useHatchyContract'

const useTokenBalance = (token: string, updater: string) => {
  const { account, provider:library, chainId } = useActiveWeb3React()
  const tokenContract = useTokenContract(token)

  const [balance, setBalance ] = useState(getBigNumber('0'))

  useEffect(() => {
    const fetch = async () => {
      let tempBalance = ethers.BigNumber.from('0')
      if(tokenContract && account && library && ethers.utils.isAddress(account)
        && chainId==DefaultChainID){
        if(token === zeroAddress) {
          tempBalance = await library.getBalance(account)
        } else {
          tempBalance = await tokenContract.balanceOf(account)
        }
      }
      
      setBalance(tempBalance)
    }

    if(token && account) {
      fetch()
    }

  }, [token, account, updater])
  
  return balance
}

export default useTokenBalance
