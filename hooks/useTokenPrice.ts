import { useContext } from 'react'
import { TokenPriceContext } from '../contexts/TokenPriceContext'
import { Price } from '../types'
import { getCurrencyFromAddressOrId } from '../utils/numberFormatterHelper'

const useTokenPrice = (id: any) => {
  const { prices } = useContext(TokenPriceContext)
  const currencyObj = getCurrencyFromAddressOrId(id)

  // {
  //   id: 'binancecoin',
  //   name: 'BNB',
  //   address: zeroAddress,
  //   symbol: 'BNB',
  //   chainId: 56,
  //   decimals: 18,
  //   icon: '',
  // }

  if(id && currencyObj) {
      return {
        ...currencyObj,
        usdPrice: (prices[id] as Price)?.usd || 0
      }
  }

  return prices
}

export default useTokenPrice
