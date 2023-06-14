export default function useCopyText() {
    const copy = async (
        text: string,
        navigator: Navigator,
        window: Window
    ) => {
	    if (navigator.userAgent.includes("MetaMaskMobile")) {
			window.prompt("Copy to clipboard", text);
		    return;
	    } else {
	        return navigator.clipboard.writeText(text);
        }
    }
    return {copy}
}