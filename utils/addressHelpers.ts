import { DefaultChainID } from '../constants';
import contracts from '../constants/contracts'

export const getAddress = (address:any) => {
  return address[DefaultChainID] ? address[DefaultChainID] : address[43114]
}

export const getMulticallAddress = () => {
  return getAddress(contracts.multiCall)
}

export const getBatchTransferAddress = () => {
  return getAddress(contracts.gen1BatchTransfer);
}

export const getHatchyNFTAddress = (gen=1) => {
  return getAddress(gen==1?contracts.hatchy:contracts.hatchyPocketGen2)
}

export const getPockyAddress = () => {
  return getAddress(contracts.token)
}

export const getStakerAddress = (gen: number=1) => {
  return getAddress(gen==1?contracts.staker:contracts.stakerGen2)
}
export const getRewarderAddress = () => {
  return getAddress(contracts.rewarder)
}

export const getHatchyPocketEggsGen2Address = () => {
  return getAddress(contracts.hatchyPocketEggsGen2);
}

export const getHatchyPocketGen2Address = () => {
  return getAddress(contracts.hatchyPocketGen2);
}

export const getTokenSaleAddress = () => {
  return getAddress(contracts.tokenSale);
}

export const getUSDTAddress = () => {
  return getAddress(contracts.usdt);
}



