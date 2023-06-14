import { useEffect } from "react";
import { coreWallet, metaMask } from "../connectors";

export default function useEagerConnect() {
    useEffect(() => {
        if (typeof window !== undefined) {
            const prefferedWallet = localStorage.getItem("_prefferred_wallet")
            if (!prefferedWallet) {
                return
            } else if (prefferedWallet == "metamask") {
                void metaMask.connectEagerly().catch(() => {
                    console.debug('Failed to connect eagerly to metamask')
                })
            } else if (prefferedWallet == "core") {
                void coreWallet.connectEagerly().catch(() => {
                    console.debug('Failed to connect eagerly to metamask')
                })
            }
        }
    }, [])

    return true;
}
