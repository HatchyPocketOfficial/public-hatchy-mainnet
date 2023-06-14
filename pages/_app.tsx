import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import '../styles/globals.css'
import type { AppContext, AppInitialProps, AppLayoutProps} from 'next/app'
import { TokenPriceContextProvider } from "../contexts/TokenPriceContext";
import { RefreshContextProvider } from "../contexts/RefreshContext";
import Web3Connection from "../components/Web3Connection";
import { WalletContextProvider } from "../contexts/WalletContext";
import { StakeContextProvider } from "../contexts/StakeContext";
import { ReactNode, useEffect} from "react";
import { AccountContextProvider } from "../contexts/AccountContext";
import { EggContextProvider } from "../contexts/gen2/EggContext";
import { NextComponentType } from "next";
import { StakeGen2ContextProvider } from "../contexts/gen2/StakeGen2Context";
import { StakeTokensContextProvider } from "../contexts/StakeTokensContext";
import { connectors } from "../connectors";

declare let window: any;

const MyApp: NextComponentType <AppContext, AppInitialProps, AppLayoutProps > = ({ 
	Component,
	pageProps 
	}: AppLayoutProps) => {
	// Use the custom layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page: ReactNode) => page);

	useEffect(() => {  
			if(window.ethereum) {
				window.ethereum.on('chainChanged', () => {
					//window.location.reload();
				})    
				window.ethereum.on('accountsChanged', () => {
					//window.location.reload();
				})
			}
		}
	);

  return (
		<div className="">
			<Web3ReactProvider connectors={connectors} lookupENS={false} >
				<Web3Connection>
					<RefreshContextProvider>
						<TokenPriceContextProvider>
							<AccountContextProvider>
								<WalletContextProvider>
									<StakeGen2ContextProvider>
										<StakeContextProvider>
											<StakeTokensContextProvider>
												<EggContextProvider>
													{getLayout(<Component {...pageProps} />)}
												</EggContextProvider>
											</StakeTokensContextProvider>
										</StakeContextProvider>
									</StakeGen2ContextProvider>
								</WalletContextProvider>
							</AccountContextProvider>
						</TokenPriceContextProvider>
					</RefreshContextProvider>
				</Web3Connection>
			</Web3ReactProvider>
		</div>
	)
}

export default MyApp
