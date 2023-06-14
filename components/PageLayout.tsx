import React, { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import ButtonScrollTop from './ButtonScrollTop'
import Footer from './Footer'
import Navbar from './Navbar'
import SocialNetworksBanner from './SocialNetworksBanner'
import 'react-toastify/dist/ReactToastify.css';
import MiniNavbar from './Home/MiniNavbar'
import SEOHead from './GeneralUI/SEOHead'
import { getToken } from '../utils/accounts'
import { useAccount } from '../contexts/AccountContext'
import Image from 'next/image'

interface PageLayoutProps{
	children: ReactNode
	className?: string
	coloredFooter?: boolean
}

export default function PageLayout({children, className, coloredFooter=false}:PageLayoutProps) {
	const { userInfo} = useAccount();
	return (
		<main className={`h-auto min-h-screen relative flex flex-col bg-black pb-24 ${className}`}>
			<SEOHead />
      <Navbar />
			<MiniNavbar />
      <ButtonScrollTop />
      <SocialNetworksBanner />
			{children}
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable={false}
				pauseOnHover
			/>
			<Footer colored={coloredFooter}/>
		</main>
	)
}
