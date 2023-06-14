import { useState } from "react";
import Button from "../Button";
import ConnectWalletModal from "./ConnectWalletModal";

interface Props{
    message?: string
}
export default function ConnectWalletModalWrapper({
    message='Connect your wallet to view your Account'
}:Props) {
    const [showWalletModal, setShowWalletModal] = useState(false);
    const openWalletModal = () => setShowWalletModal(true);
    const closeWalletModal = () => setShowWalletModal(false);

    if (!showWalletModal) return <>
        <Button onClick={openWalletModal} label={message} />
    </>
    return <ConnectWalletModal isOpen={showWalletModal} closeModal={closeWalletModal} />
}