import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import Image from 'next/image';
import NavbarItem from './NavbarItem';
import { DefaultChainID } from '../constants';
import { useAccount } from '../contexts/AccountContext';
import ConnectWalletModal from './WalletConnect/ConnectWalletModal';
import { setupNetwork } from '../utils/wallet';


//temporary solution
declare let window: any;
export default function Navbar() {
	const { account, provider: library, chainId, isActive, isActivating } = useWeb3React();
	const isConnected = typeof account === "string" && !!library;
	const { userInfo } = useAccount();
	const router = useRouter()
	const [showNavbar, setShowNavbar] = useState(false)
	const ref = React.useRef<HTMLDivElement>(null);
	const close = () => setShowNavbar(false);
	const [showWalletModal, setShowWalletModal] = useState(false);
	const openWalletModal = () => setShowWalletModal(true);
	const closeWalletModal = () => setShowWalletModal(false);
	const [isWalletInstalled, setIsWalletInstalled] = useState(false);

	useEffect(() => {
		const checkIfClickedOutside = (e: any) => {
			// If the menu is open and the clicked target is not within the menu,
			// then close the menu
			if (showNavbar && ref.current) {
				close()
			}
		}
		document.addEventListener("click", checkIfClickedOutside)
		return () => {
			// Cleanup the event listener
			document.removeEventListener("click", checkIfClickedOutside)
		}
	}, [showNavbar])

	const links = [
		{
			label: 'Home',
			route: 'home',
		},
		{
			label: 'Marketplace',
			route: 'marketplace'
		},
	]

	useEffect(() => {
		if (typeof window.ethereum !== 'undefined' ||
			typeof window.web3 !== 'undefined')
			setIsWalletInstalled(true);
	}, [])


	function renderMetamaskButton() {
		if (isWalletInstalled) {
			if (isActive && chainId != DefaultChainID) {
				return (
					<div>
						<button className="nav-item flex flex-row font-bold h-16 w-36 px-3 justify-center items-center
            	             lg:h-14 " onClick={setupNetwork}>
							<div className='w-full flex justify-center items-center mr-1'>
								<Image src="/static/wallet.png" width={36} height={36} alt="Wallet" />
							</div>
							<div >
								<span className='text-xs'>Switch</span><br />
								<span className='text-orange-light'>Network</span>
							</div>
						</button>
					</div>
				);
			}
			if (isConnected) {
				return (
					<>
						<NavbarItem route={'claim'} label={'Claim'} />
						<NavbarItem route={'staking'} label={'Staking'} />
						<NavbarItem route={'wallet'} label={'Wallet'} />
						<div className={`nav-item h-16 w-32 px-3 flex justify-center text-center items-center
															lg:w-20 lg:h-14 ${router.pathname == '/account' ? "active" : ''} `} >
							<Link href={`/account`}>
								{userInfo && userInfo.avatar ?
									<a className=''>
										<div className='m-auto pixelate bg-white border-white relative rounded-full overflow-hidden'>
											<div className='relative w-10 h-10'>
												<Image src={`https://account-test.hatchypocket.com/images/${userInfo.avatar}`}
													alt="egg"
													layout='fill'
													objectFit='cover' />
											</div>
										</div>
									</a>
									:
									<a className='w-full h-full flex justify-center items-center'>
										<Icon icon="carbon:user-avatar-filled" width={30} />
									</a>
								}

							</Link>
						</div>
					</>
				)
			} else {
				if (!isActivating) {
					return (
						<div>
							<button className="nav-item flex flex-row font-bold h-16 w-36 px-3 justify-center items-center
																 lg:h-14" onClick={openWalletModal}>
								<div className='w-full flex justify-center items-center mr-1'>
									<Image src="/static/wallet.png" width={36} height={36} alt="Wallet" className='w-full' />
								</div>
								<div className=''>
									<span className='text-xs'>Connect</span><br />
									<span className='text-orange-light '>Wallet</span>
								</div>
							</button>
						</div>
					)
				}
				return <></>;
			}
		} else {
			return (
				<div>
					<a href="https://www.metamask.io" rel="noreferrer" target="_blank" className="nav-item flex flex-row font-bold h-16 w-36 px-3 justify-center items-center
									lg:h-14">
						<div className='w-full flex justify-center items-center mr-1'>
							<Image src="/static/metamask.svg" width={100} height={100} alt="Metamask" className='w-full' />
						</div>
						<div>
							<span className='text-xs'>Download</span><br />
							<span className='text-orange-light'>METAMASK/CORE</span>
						</div>
					</a>
				</div>
			)
		}
	}

	return (
		<nav className="absolute top-0 w-full h-14 bg-gray-50 flex flex-row justify-end font-bold text-lg
          lg:h-auto lg:max-h-14">
			{!(router.pathname == '/home' || router.pathname == '/') &&
				<Link href="/" passHref>
					<button className="absolute top-0 left-0 z-[19] w-32 md:w-40 h-20 md:h-24" >
						<div className='relative w-full h-full'>
							<Image src="/hatchy_logo.png" alt="hatchy pockets logo"
								layout='fill' objectFit='contain' />
						</div>
					</button>
				</Link>
			}
			<ConnectWalletModal isOpen={showWalletModal} closeModal={closeWalletModal} />
			<div className="m-auto flex flex-row mr-3 p-2  cursor-pointer lg:hidden" onClick={() => setShowNavbar(true)}>
				<Icon icon="fa-solid:bars" width={25} />
			</div>
			<div className={`${showNavbar ? 'flex' : 'hidden'} absolute top-14  bg-gray-50 flex-col space-y-3 w-full justify-end text-center items-center z-10
              lg:static lg:flex-row lg:space-y-0 lg:flex lg:top-20`} ref={ref}>
				<div>
					<a href="https://forms.gle/naTdFCnReEkjSApu5" rel="noreferrer" target="_blank" className="nav-item-highlight h-16 w-36 px-3 flex justify-center text-center items-center 
                      lg:w-32 lg:h-14 ">
						<div className='mr-2'>
							<span className='text-xs -mb-8 flex'>Leave your</span><br />
							<span className='text-sm'>Feedback</span>
						</div>
						<Icon icon="fluent:person-feedback-24-filled" width={30} />
					</a>
				</div>
				{links.map(link => (
					<NavbarItem route={link.route} label={link.label} key={link.route} />
				))}
				{renderMetamaskButton()}
			</div>
		</nav>
	)
}
