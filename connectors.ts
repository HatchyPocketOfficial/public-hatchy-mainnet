import {initializeConnector} from '@web3-react/core'
import {Avalanche} from '@avalabs/avalanche-connector'
import {MetaMask} from '@web3-react/metamask'
import {Web3ReactHooks} from '@web3-react/core'
import {Connector} from '@web3-react/types'

export const [coreWallet, useCoreWallet] = initializeConnector(
  // @ts-ignore
  (actions) => new Avalanche(actions, false)
);

export const [metaMask, useMetaMask] = initializeConnector(
  (actions) =>
    new MetaMask(
      {
      	actions
      }
    )
)

export const connectors: [Connector, Web3ReactHooks][] = [
  [metaMask, useMetaMask],
  [coreWallet, useCoreWallet],
]