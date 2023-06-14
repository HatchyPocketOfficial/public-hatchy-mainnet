import React, { useState, useEffect, ReactNode } from 'react'
import { Currencies, DefaultChainID } from '../constants'
import useRefresh from '../hooks/useRefresh'

const TokenPriceContext = React.createContext({ prices: [] })

const TokenPriceContextProvider = ({ children }:{children: ReactNode}) => {
  const [prices, setPrices] = useState([])
  const { slowRefresh } = useRefresh();
  
  useEffect(() => {
    const currencies = Currencies[DefaultChainID].map(item => item.id).join(',');
    // axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${currencies}&vs_currencies=usd`)
    // .then(res => {
    //   setPrices(res.data);
    // })
  }, [slowRefresh])

  return <TokenPriceContext.Provider value={{ prices: prices }}>{children}</TokenPriceContext.Provider>
}

export { TokenPriceContext, TokenPriceContextProvider }
