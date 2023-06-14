import { coreWallet, metaMask } from '../../connectors';
import { mainChainId, SUPPORTED_NETWORKS, switchNetwork } from '../useAuth';

export default function useWalletConnect(
) {
	const getLastWallet = () => {
		if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
			const lastUsedWallet = localStorage.getItem('_prefferred_wallet');
			return lastUsedWallet;
		}
		return "";
	}

	const connectWithMetamask = async () => {
		const lastWallet = getLastWallet()
		coreWallet?.deactivate?.()
		metaMask.activate(mainChainId || SUPPORTED_NETWORKS[mainChainId] as any).then(r => {
			localStorage.setItem("_prefferred_wallet", "metamask")
			switchNetwork(coreWallet.provider)
			return true;
		}).catch((error) => {
			console.log(error);
		})
		return false;
	}

	const connectWithCore = async () => {
		const lastWallet = getLastWallet()
		metaMask?.deactivate?.()
		// coreWallet.activate(parseInt(desiredChainIdNumber) === -1 ? undefined : getAddChainParameters(desiredChainIdNumber))
		coreWallet.activate(mainChainId || SUPPORTED_NETWORKS[mainChainId] as any).then(r => {
			localStorage.setItem("_prefferred_wallet", "core")
			switchNetwork(coreWallet.provider)
			return true;
		}).catch((error) => {
			console.log(error);
		})
		return false;
	}

	return {
		getLastWallet,
		connectWithMetamask,
		connectWithCore
	};
}