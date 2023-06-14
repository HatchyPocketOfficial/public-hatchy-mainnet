import type { NextPage } from 'next'
import Banner from '../components/Banner'
import Button from '../components/Button'
import HatchyCardInfo from '../components/Wallet/HatchyCardInfo'
import React, { useEffect, useState } from 'react'
import CollectionGrid from '../components/Home/CollectionGrid'
import PageLayout from '../components/PageLayout'
import Image from 'next/image'
import Router from 'next/router'
import Input from '../components/Input'
import HatchedInfo from '../components/HatchedInfo'
import GenSelector from '../components/Utility/GenSelector'
import { getHatchieData } from '../utils/metadataArraysUtils'
import { useWallet } from '../contexts/WalletContext';
import { Link } from 'react-scroll';
import { Icon } from '@iconify/react';
import useJoinMailingList from '../hooks/Accounts/useJoinMailingList'
import { useWeb3React } from '@web3-react/core'

const HomePage: NextPage = () => {
	const [email, setEmail] = useState("");
	const [selectedHatchyID, setSelectedHatchyID] = useState(1);
	const [filterCollection, setFilterCollection] = useState(false);
	const [showSubscriptionMsg, setShowSubscriptionMsg] = useState(false);
	const [currentGen, setCurrentGen] = useState(1);
	const {gen} = useWallet();	
	const {subscribeMailingList} = useJoinMailingList();
	const { account } = useWeb3React()

	useEffect(() => {
		if(gen==2) setSelectedHatchyID(40);
		if(gen==1) setSelectedHatchyID(1);
	}, [gen])
	
	const setCommonColl = () => {
		setFilterCollection(false)
	}
	const setShinyColl = () => {
		setFilterCollection(true)
	}
	const subscribeNewsletter = () => {
		if (email != "") {
			subscribeMailingList(email).then(data=>{
				setShowSubscriptionMsg(true)
				setEmail("")
			}).catch(err=>{
				console.log(err);
			});
		}
	}
	
	return (
		<PageLayout>
			{/*Info */}
			<section className='flex flex-col px-8 text-center text-gray-200 justify-center items-center py-20 
        bg-kingdom bg-center bg-cover w-full space-y-10 pt-32 
				h-full lg:space-y-16 lg:pt-40'>
				{/* Gen 1 card 
				<div className='hidden justify-end items-center w-1/3 h-full overflow-visible pt-32
				lg:flex'>
					<div className={`shiny pixelate cursor-pointer  ease-in duration-300 relative
					w-72 h-72`} >
						<Image alt={'gen 1 hatchy'} layout='fill' objectFit='contain'
						src={getShinyCardFilename(gen1Hatchy)} />
					</div>
				</div>
				<div className='hidden justify-start items-center w-1/3 h-full overflow-visible pt-32
				lg:flex relative'>
					<div className={`shiny pixelate cursor-pointer  ease-in duration-300 relative
					w-[30rem] h-[30rem]`} >
						<Image alt={'gen 2 hatchy'} layout='fill' objectFit='contain'
						src={getShinyCardFilename(gen2Hatchy)} />
					</div>
					<Link to='collection' spy={true} smooth={true} duration={500}
					className='absolute bottom-0 flex justify-center items-end w-full animate-bounce'>
						<Button label='VIEW NEW GEN 2!!' color='green'/>
					</Link>
				</div>
				*/}
				<div className='w-full h-48 relative flex justify-center items-center
				md:h-60 md:mb-10'>
					<Image src={"/hatchy_logo.png"} alt='hatchy pockets logo' layout='fill' objectFit='contain' />
				</div>
				<Button label='GET SOME HATCHIES!' onClick={() => Router.push('/claim')} />
				<p className='max-w-xl text-base text-white bg-black bg-opacity-40 p-5
				md:text-xl'>
					Hatchy pocket is a decentralized Intellectual Property(IP) owned and managed by a Decentralized Autonomous Organization(DAO)
				</p>
				<Link to='collection' spy={true} smooth={true} duration={500}
				className='flex flex-col justify-center items-center w-full pt-10 
				md:mt-20'>
					<Button label='VIEW COLLECTION!' color='green' />
					<Icon icon='bx:chevron-down' width={60} className='cursor-pointer' />
				</Link>
			</section>
			<div className='bg-long bg-top bg-cover h-auto w-full py-5' id='collection'>
				{/*Collection */}
				<section className='flex flex-col px-8 text-center text-gray-200 items-center  space-y-2
          			w-full justify-center '>
					<Banner title='COLLECTION' white />
					<div className='flex flex-col  max-w-xs relative pb-10 
					lg:flex-row'>
						{ account &&
							<div className='mb-5 lg:absolute -left-72 top-5'>
								<HatchedInfo />
							</div>
						}
						<HatchyCardInfo hatchy={getHatchieData(selectedHatchyID)} showShinyCollection={filterCollection} />
						<div className='flex flex-col w-full mt-5 space-y-2 
              				lg:absolute -right-56 top-0 lg:w-auto'>
							<Button label='COMMON' color='black' className='w-full lg:w-52' onClick={setCommonColl} selected={!filterCollection} />
							<Button label='SHINY' color='black' className='w-full lg:w-52' onClick={setShinyColl} selected={filterCollection} />
						</div>
					</div>
					<div className='w-full max-w-7xl'>
						<GenSelector showNewPopup />
					</div>
					<CollectionGrid setSelectedHatchyID={setSelectedHatchyID} selectedHatchy={selectedHatchyID} showShinyCollection={filterCollection} gen={currentGen} />
					{/* showShinyCollection={filterCollection}  */}
				</section>
			</div>
			<div className='flex flex-col justify-center items-center py-10 self-center
			w-full max-w-xs
			md:max-w-2xl'>
				<p className='text-white text-xl font-bold text-center'>
					Join our mailing list now to receive the most up to date news!
				</p>
				<div className='flex flex-row justify-center mt-3 w-full '>
					{showSubscriptionMsg ?
						<div className='flex flex-col bg-green-dark bg-opacity-100 text-white
						justify-center px-4 py-3 border-4 border-green font-bold'>
							<span>Thank you for subscribing!</span>
							<span>Check the email we sent you to complete the process</span>
						</div>
						:
						<div className='flex flex-col justify-center items-center w-full space-y-2 
						md:flex-row md:space-x-5 md:space-y-0 '>
							<Input value={email} onChange={setEmail}  placeholder='example@org.com' 
							className='w-full  h-12 text-gray-dark md:w-3/5'/>
							<Button label='Join list' color='green' onClick={() => subscribeNewsletter()} 
							className="w-full md:w-auto" />
						</div>
					}
				</div>
			</div>
		</PageLayout >

	)
}

export default HomePage

