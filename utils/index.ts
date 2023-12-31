import { BigNumber, ethers, utils } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
const commaNumber = require('comma-number');

const format = commaNumber.bindWith(',', '.');

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function getFtmScanLink(data: string, type: 'transaction' | 'token' | 'address'): string {
  const prefix = `https://etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}


export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function toWei(ether: string, decimals = 18): BigNumber {
  return utils.parseUnits(ether, decimals);
}

export function toEth(ether: ethers.BigNumberish, decimals = 18): string {
  return utils.formatUnits(ether, decimals);
}

export const getApy = (apr: number, compoundFrequency = 1, days = 365, performanceFee = 0) => {
  const daysAsDecimalOfYear = days / 365
  const aprAsDecimal = apr / 100
  const timesCompounded = 365 * compoundFrequency
  let apyAsDecimal = (apr / 100) * daysAsDecimalOfYear
  if (timesCompounded > 0) {
    apyAsDecimal = (1 + aprAsDecimal / timesCompounded) ** (timesCompounded * daysAsDecimalOfYear) - 1
  }
  if (performanceFee) {
    const performanceFeeAsDecimal = performanceFee / 100
    const takenAsPerformanceFee = apyAsDecimal * performanceFeeAsDecimal
    apyAsDecimal -= takenAsPerformanceFee
  }
  return apyAsDecimal
}

//Duplicated in numberFormatterHelper
/*
export const getBigNumber = (value:any) => {
  if (!value) {
    return BigNumber.from(0);
  }
  if (BigNumber.isBigNumber(value)) {
    return value;
  }
  return BigNumber.from(value);
};
*/

export const currencyFormatter = (labelValue:any) => {
  let suffix = '';
  let unit = 1;
  const abs = Math.abs(Number(labelValue));
  if (abs >= 1.0e9) {
    // Nine Zeroes for Billions
    suffix = 'B';
    unit = 1.0e9;
  } else if (abs >= 1.0e6) {
    // Six Zeroes for Millions
    suffix = 'M';
    unit = 1.0e6;
  } else if (abs >= 1.0e3) {
    // Three Zeroes for Thousands
    suffix = 'K';
    unit = 1.0e3;
  }
  return `${format(Math.floor(abs / unit * 100) / 100)}${suffix}`;
  // return Math.abs(Number(labelValue)) >= 1.0e9
  //   ? `$${format(
  //       new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e9}`).dp(2, 1)
  //     )}B`
  //   : Math.abs(Number(labelValue)) >= 1.0e6
  //   ? `$${format(
  //       new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e6}`).dp(2, 1)
  //     )}M`
  //   : Math.abs(Number(labelValue)) >= 1.0e3
  //   ? `$${format(
  //       new BigNumber(`${Math.abs(Number(labelValue)) / 1.0e3}`).dp(2, 1)
  //     )}K`
  //   : `$${format(new BigNumber(`${Math.abs(Number(labelValue))}`).dp(2, 1))}`;
};



export const formatter = (value: string, decimals = 2, suffixStr = '') => {
  let suffix = '';
  let unit = 1;
  if(isNaN(parseFloat(value))) {
    return null;
  }
  const abs = Number(value) || 0;

  if (abs >= 1.0e9) {
    // Nine Zeroes for Billions
    suffix = 'B';
    unit = 1.0e9;
  } else if (abs >= 1.0e6) {
    // Six Zeroes for Millions
    suffix = 'M';
    unit = 1.0e6;
  } else if (abs >= 1.0e3) {
    // Three Zeroes for Thousands
    suffix = 'K';
    unit = 1.0e3;
  }

  return `${format(Math.floor(abs / unit * Math.pow(10, decimals)) / Math.pow(10, decimals))}${suffix} ${suffixStr || ''}`;
};