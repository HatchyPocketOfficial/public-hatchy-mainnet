import type { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import Banner from '../components/Banner'
import Button from '../components/Button'
import DAOModal from '../components/DAO/DAOModal'
import DAOTitle from '../components/DAO/DAOTitle'
import PageLayout from '../components/PageLayout'


const DAOPage: NextPage = () => {
	const [showModal, setShowModal] = useState(false)
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	return (
		<PageLayout className={"text-center"}>
			<div className="bg-dao bg-cover w-auto h-auto text-center pt-14 flex flex-col items-center">
				<Banner title='HATCHY POCKET DAO' className='mt-20 md:mt-16'/>
				<DAOModal isOpen={showModal} closeModal={closeModal} />
				<div className='flex flex-col w-full justify-center items-center max-w-xl'>
				{/*
					<section className='flex-col items-center justify-center relative '>
						<div className='flex flex-col h-auto claim-egg border-4 border-white relative items-center justify-center py-2
            md:flex-row md:w-auto'>
							<div className='flex-col w-auto h-auto m-1'>
								<h1 className='bg-yellow text-gray-dark text-5xl p-5 font-black'>
									000M
								</h1>
								<p className='text-white'>
									Marketcap
								</p>
							</div>
							<div className='flex-col w-auto h-auto m-1 text-center'>
								<h1 className='bg-yellow text-gray-dark text-5xl p-5  font-black'>
									000M
								</h1>
								<p className='text-white'>
									Users
								</p>
							</div>
							<div className='flex-col w-auto h-auto m-1 text-center'>
								<h1 className='bg-yellow text-gray-dark text-5xl p-5  font-black'>
									000M
								</h1>
								<p className='text-white'>
									Assets
								</p>
							</div>
						</div>
						<Button label='GO TO DAO DASHBOARD' color='green' className='mt-4 absolute top-0 left-0'
							onClick={openModal} />
					</section>
				*/}
					<section className='flex justify-center items-center'>
						<div className='bg-white h-auto m-5 p-5 text-gray-dark text-left slanted'>
							<p>
								Hatchy Pocket is a decentralized Intellectual Property
								(IP) owned and managed by Decentralized
								Autonomous Organization (DAO).
							</p><br />
							<p>
								A DAO is a decentralized group that can make governance decisions onchain using blockchain
								technology to verify that voting rules are strictly
								followed.
							</p><br />
							<p>
								Anyone can join the Hatchy Pocket DAO by earning $HATCHY Tokens.
							</p><br />
							<p>
								The owners of the collection become the owners of the brand.
							</p>
						</div>
					</section>
					<section>
						<DAOTitle title='Hatchy Token' />
						<h1 className='font-government m-8 text-center text-white'>
							{"UNLOCK EXPERIENCES AND BE EMPOWERED WITH YOUR HATCHY!"}
						</h1>
						<div className='bg-white h-auto m-5 p-5 text-gray-dark text-left slanted md:'>
							<p>
								Owners are rewarded tokens that give them access to
								a growing ecosystem of games and interactive
								experiences.
							</p>
							<div className='flex flex-row justify-center items-center'>
								<div className='relative flex justify-center items-center'>
									<div className='w-20 h-16 relative md:w-32 md:h-28'>
										<Image src={"/static/misc/block.png"} alt='Egg' layout='fill' />
									</div>
									<span className='absolute inset-auto'>
										Hatchy
									</span>
								</div>
								<div className='w-4 h-7 mx-1 relative'>
									<Image src={'/static/misc/arrow.png'} alt='Arrow' layout='fill' />
								</div>
								<div className='relative flex justify-center items-center'>
									<div className='w-20 h-16 relative md:w-32 md:h-28'>
										<Image src={"/static/misc/block.png"} alt='Egg' layout='fill' />
									</div>
									<span className='absolute inset-auto'>
										$HATCHY
									</span>
								</div>
								<div className='w-4 h-7 mx-1 relative'>
									<Image src={'/static/misc/arrow.png'} alt='Arrow' layout='fill' />
								</div>
								<div className='relative flex justify-center items-center'>
									<div className='w-20 h-16 relative md:w-32 md:h-28'>
										<Image src={"/static/misc/block.png"} alt='Egg' layout='fill' />
									</div>
									<span className='absolute inset-auto'>
										Games
									</span>
								</div>
							</div>
						</div>
					</section>
					<section className='flex-col items-center justify-center'>
						<DAOTitle title='Staking and voting' />
						<h1 className='font-government m-8 text-center text-white'>
							COMMUNITY BECOME OWNERS IN THE BRAND THEY HELP BUILD!
						</h1>
						<div className='bg-white h-auto m-5 p-5 text-gray-dark text-left slanted'>
							<ul className='list-disc list-inside'>
								<li>Each $HATCHY token can vote in DAO governance events</li>
								<li>Each token has a portion of the IP ownership and can vote on the development of the DAO en ecosystem
								</li>
								<li>Owners choose which devs and projects are supported</li>
								<li>Owners choose which artist and assets are created</li>
							</ul>
						</div>
					</section>
					<section className='flex-col items-center justify-center'>
						<DAOTitle title='License' />
						<h1 className='font-government m-8 text-center text-white'>
							{"SIMPLE, EASY TO FOLLOW RULES FOR RESPONSIBILITIES AND EXPECTATIONS"}
						</h1>
						<div className='bg-white h-auto m-5 p-5 text-gray-dark text-left slanted'>
							<ul className='list-disc list-inside'>
								<li>Non-profit usage is free</li>
								<li>All representative work must adhere to style guide</li>
								<li>Commercial usage with permission from DAO</li>
								<li>Dev wallets are manually added and automatically taxed
									<ul className='list-disc list-inside'>
										<li>Must apply to use</li>
										<li>Must apply from owner wallet</li>
										<li>Must own $HATCHY token</li>
									</ul>
								</li>
								<li>Contract void if payment not made or evaded</li>
								<li>DAO reserves right to revoke usage permissions if it considers any negotiation voided</li>
								<li>Terms as above or explicitly agreed by DAO vote</li>
							</ul>
						</div>
					</section>
					<section className='flex-col m-auto items-center justify-center'>
						<DAOTitle title='Developer Wallets' />
						<h1 className='font-government m-8 text-center text-white'>
							{"EASY AUTOMATION OF ACCOUNTING SO CREATORS CAN FOCUS ON FUN"}
						</h1>
						<div className='bg-white h-auto m-5 p-5 text-gray-dark text-left slanted'>
							<p>
								Commercial products are automatically taxed all
								$HATCHY from dev wallets are taxed 10%
							</p>
							<ul className='list-disc list-inside'>
								<li>9% is redistributed to $HATCHY token holders</li>
								<li>1% is stored in reserve for general DAO</li>
							</ul>
						</div>
					</section>
				</div>
			</div>
		</PageLayout>
	)
}

export default DAOPage

