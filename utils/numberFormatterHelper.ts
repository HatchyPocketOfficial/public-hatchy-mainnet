import { BigNumber, BigNumberish, ethers } from "ethers";
import { Currencies, DefaultChainID } from "../constants";
import { AssetType } from "../types";
import NumberSuffix from 'number-suffix';
export const filter = (num: number, precision = 2)=>{
	if (num>=1000) {
		return NumberSuffix.format(num, {precision});
	} else {
		return num.toFixed(precision);
	}
}

export function shortenHex(hex:string, length = 4) {
  if(!hex) return ''
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
}

export const parseBalance = (balance:BigNumberish, decimals = 18, decimalsToDisplay = 3) =>
  Number(ethers.utils.formatUnits(balance, decimals)).toFixed(decimalsToDisplay);

export const numberWithCommas = (x:number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const nFormatter = (num: number, digits: number) => {
  var si = [
    {value: 1, symbol: ''},
    {value: 1e3, symbol: 'k'},
    {value: 1e6, symbol: 'M'},
    {value: 1e9, symbol: 'B'},
    {value: 1e12, symbol: 'T'},
    {value: 1e15, symbol: 'P'},
    {value: 1e18, symbol: 'E'},
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};


export function toWei(ether: string) {
  return ethers.utils.parseEther(ether);
}

export function toEth(wei: BigNumberish) {
  return ethers.utils.formatEther(wei);
}


export function getBigNumber(value:string) {
  return ethers.BigNumber.from(String(value))
} 

export function getCurrencyFromAddressOrId (idOrAddress: string){
  const currencies = Currencies[DefaultChainID];

  if(currencies && idOrAddress) {
      const currency = currencies.find(item => (item.id === idOrAddress 
        || item.address.toLowerCase() === idOrAddress.toLowerCase()
        || item.name.toLowerCase() === idOrAddress.toLowerCase()));
      if(!currency){
        console.log('getCurrencyFromAddressOrId idOrAddress:',idOrAddress,currencies,DefaultChainID)
      }  
        
      return currency;
  }

  return null;
}

export function getSymbolFromAddressOrId (idOrAddress: string) {
  const currencyObj = getCurrencyFromAddressOrId(idOrAddress)
  if(currencyObj) {
    return currencyObj.name
  }
  return '';
}

export function formatPrice(price: number, currency: string) {
  const currencyObj = getCurrencyFromAddressOrId(currency)
  if(currencyObj){
    const priceStr = (+price * (10 **(18 - currencyObj.decimals))).toString()
    //check if priceStr should be string or number
    return `${nFormatter(parseInt(priceStr), 4)} ${currencyObj.symbol}`
  }
  return null;
}

export function formatPriceUsd(price: number, currency: string, usd: number) {
  const currencyObj = getCurrencyFromAddressOrId(currency)
  if(currencyObj){
    const priceStr = (+price * (10 **(18 - currencyObj.decimals)) * usd).toString()
    return `${nFormatter(parseInt(priceStr), 4)} USD`
  }
  return null
}

export const formatHatchyTokenToInt = (amount: BigNumber) => {
	return parseInt(ethers.utils.formatEther(amount.toString()));
}
export const formatHatchyTokenToString = (amount: BigNumber) => {
	return parseInt(ethers.utils.formatEther(amount.toString())).toString();
}

export const formatHatchyTokenToBigNumber = (amount: number) => {
  try {
    let bigNumberAmount = BigNumber.from(Math.trunc(amount));
    return bigNumberAmount.mul(BigNumber.from("10").pow(18));
  } catch (error) {
    return BigNumber.from(0);  
  }
}

export const formatHatchyPrice = (price: string) => {
	return BigNumber.from(price || "0").mul(100).div(BigNumber.from(10).pow(18)).toNumber() / 100
}

const download = (link: string, name: string) => {
  var element = document.createElement("a");
  var file = new Blob(
    [
      link
    ],
    { type: "image/*" }
  );
  element.href = URL.createObjectURL(file);
  element.download = "image.jpg";
  element.click();
};

export function isSameAddress(addr1: string, addr2: string) {
  return ethers.utils.isAddress(addr1) 
    && ethers.utils.isAddress(addr2)
    && addr1?.toLowerCase() === addr2?.toLowerCase()
}

export const assetType = (type: string) => {
  if(!type) return AssetType.NONE;

  if(type.includes('image/')) return AssetType.IMAGE;
  if(type.includes('video/')) return AssetType.VIDEO;
  if(type.includes('audio/')) return AssetType.AUDIO;

  return AssetType.NONE
}