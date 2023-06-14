import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { connectorLocalStorageKey, useActiveWeb3React } from '.'
import { DefaultChainID } from '../constants'

export const SUPPORTED_NETWORKS = {
	[43114]: {
		chainId: '43114',
		chainName: 'Avalanche',
		nativeCurrency: {
			name: 'Avalanche Token',
			symbol: 'AVAX',
			decimals: 18,
		},
		rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
		blockExplorerUrls: ['https://cchain.explorer.avax.network'],
	},
	[43113]: {
		chainId: '43113',
		chainName: 'Avalanche FUJI C-Chain',
		nativeCurrency: {
			name: 'Avalanche Token',
			symbol: 'AVAX',
			decimals: 18,
		},
		rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
		blockExplorerUrls: ['https://testnet.snowtrace.io/'],
	},
	[4]: {
		chainId: '4',
		chainName: 'Rinkeby Test Network',
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://eth-rinkeby.alchemyapi.io/v2/BfF4NVDV-KedVsrZCdX4yJkTBO6JFvju'],
		blockExplorerUrls: ['https://rinkeby.etherscan.io'],
	},
	[1]: {
		chainId: '1',
		chainName: 'Ethereum Mainnet',
		nativeCurrency: {
			name: 'Ethereum',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://rpc.flashbots.net'],
		blockExplorerUrls: ['https://etherscan.io'],
	},
}

export const mainChainId = DefaultChainID;

//Check library type
export const switchNetwork = async (library: any) => {

	const params = SUPPORTED_NETWORKS[mainChainId]
	// if (supoortChain === 1) {
	//   library?.send('wallet_switchEthereumChain', [{ chainId: '0x1' }, account])
	// } else {

	// }

	library?.send('wallet_addEthereumChain', [params])
}

const useAuth = () => {
	const { } = useWeb3React()
	const { chainId, provider: library, account } = useActiveWeb3React()

	const logout = useCallback(() => {
		window.localStorage.removeItem(connectorLocalStorageKey)
		// deactivate()
	}, [])

	const login = useCallback((connectorID) => {
		// const connector = connectorsByName[connectorID]
		// if (connector) {

		// 	activate(connector, async (error: Error) => {
		// 		window.localStorage.removeItem(connectorLocalStorageKey)
		// 		if (error instanceof UnsupportedChainIdError) {
		// 			toast.error('Unsupported Chain Id Error. Check your chain Id!')
		// 		} else if (error instanceof NoEthereumProviderError) {
		// 			toast.error('No provider was found!')
		// 		} else if (
		// 			error instanceof UserRejectedRequestErrorInjected ||
		// 			error instanceof UserRejectedRequestErrorWalletConnect
		// 		) {
		// 			if (connector instanceof WalletConnectConnector) {
		// 				const walletConnector = connector as WalletConnectConnector
		// 				walletConnector.walletConnectProvider = undefined;
		// 			}
		// 			toast.error('Authorization Error, Please authorize to access your account')
		// 			console.log('Authorization Error, Please authorize to access your account')
		// 		} else {
		// 			toast.error(error.message)
		// 			console.log(error.name, error.message)
		// 		}
		// 	})
		// } else {
		// 	toast.error("Can't find connector, The connector config is wrong")
		// 	console.log("Can't find connector", 'The connector config is wrong')
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { login, logout }
}

export default useAuth
