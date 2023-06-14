import { useWeb3React } from '@web3-react/core'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import Banner from '../../components/Banner'
import Button from '../../components/Button'
import LoadingModal from '../../components/LoadingModal'
import PageLayout from '../../components/PageLayout'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import AccountFriends from '../../components/Account/AccountFriends'
import AccountReferrals from '../../components/Account/AccountReferrals'
import AccountProgress from '../../components/Account/AccountProgress'
import BadgesModal from '../../components/Account/BadgesModal'
import { Badge, BadgeObject, BadgeProgress } from '../../types'
import EditAccountModal from '../../components/Account/EditAccountModal'
import { useAccount } from '../../contexts/AccountContext'
import VerificationModal from '../../components/Account/VerificationModal'
import { useRouter } from 'next/router'
import AccountSearchPage from '../../components/Account/AccountSearchPage'
import { displayError, displaySuccess } from '../../utils/ErrorMessage'
import EditAvatarModal from '../../components/Account/EditAvatarModal'
import useAccountReferrals from '../../hooks/Accounts/useAccountReferrals'
import EmailVisibilitySelect from '../../components/Account/EmailVisibilitySelect'
import { ACCOUNTS_IMAGES_URL } from '../../constants'
import AdminPage from '../admin'
import { badgesData } from '../../constants/badgesData';
import ShareReferalLinkModal from '../../components/Account/ShareReferralLinkModal'
import ConnectWalletModalWrapper from '../../components/WalletConnect/ConnectWalletModalWrapper'
import LoadingSpinnerPage from '../../components/Utility/LoadingSpinnerPage'
import { getToken } from '../../utils/accounts'
import { isMobileDevice } from '../../utils'

const AccountPage: NextPage = () => {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState('MY PROGRESS');
	const { account, provider: library, isActivating } = useWeb3React();
	
	const isConnected = typeof account === "string" && !!library;
	//account Data
	const { loadingData, loadingLogging, login, logout, userInfo, setUserInfo } = useAccount();
	const [showSurvivorsBanner, setShowSurvivorsBanner] = useState(true);

	//get referral url
	const { fetchReferralURL } = useAccountReferrals(userInfo?._id)
	//share modal
	const [showShareLinkModal, setShowShareLinkModal] = useState(false);

	const [isPictureHover, setIsPictureHover] = useState(false)

	/*Loading */
	const [isProcessing, setIsProcessing] = useState(false);
	/*Badges Modal*/
	const [showEditModal, setShowEditModal] = useState(false);
	const openEditModal = () => setShowEditModal(true);
	const closeEditModal = () => setShowEditModal(false);



	const [showEditAvatarModal, setShowEditAvatarModal] = useState(false);
	const openEditAvatarModal = () => setShowEditAvatarModal(true);
	const closeEditAvatarModal = () => setShowEditAvatarModal(false);

	const [showVerificationModal, setShowVerificationModal] = useState(false);
	const openVerificationModal = () => setShowVerificationModal(true);
	const closeVerificationModal = () => setShowVerificationModal(false);

	const [showBadgesModal, setShowBadgesModal] = useState(false);
	const openBadgesModal = () => setShowBadgesModal(true);
	const closeBadgesModal = () => setShowBadgesModal(false);

	const [badgesList, setBadgesList] = useState<Badge[]>()
	const [progressList, setProgressList] = useState<BadgeObject>()

	const [badges, setBadges] = useState<Badge[]>([
		{
			imageSrc: 'https://image.shutterstock.com/image-vector/vector-pixel-art-gold-badge-260nw-1052641061.jpg',
			name: 'Badge 1'
		},
		{
			imageSrc: 'https://image.shutterstock.com/image-vector/vector-pixel-art-gold-badge-260nw-1052641061.jpg',
			name: 'Badge 2'
		},
	])

	const pages = [
		{
			label: 'MY PROGRESS',
			component: AccountProgress
		},
		{
			label: 'FRIENDS',
			component: AccountFriends
		},
		{
			label: 'SEARCH',
			component: AccountSearchPage
		},
		{
			label: 'REFERRALS',
			component: AccountReferrals
		},
	];

	const [isCopied, setIsCopied] = useState(false)

	const copyReferalURL = () => {
		if (!isCopied) {
			fetchReferralURL().then((res) => {
				if (res?.data.code == 200) {
					setIsCopied(true)
					setTimeout(() => {
						setIsCopied(false)
					}, 5000)
					navigator.clipboard.writeText(res.data.data)
					displaySuccess('Link copied!');
				} else {
					displayError(res?.data.message)
				}
			})
		}
	}

	const changePage = (page: string) => {
		console.log(page);
	}
	const renderPage = () => {
		if (currentPage == 'ADMIN' && userInfo) {
			return <AdminPage />;
		} else {
			for (let i = 0; i < pages.length; i++) {
				const page = pages[i];
				if (currentPage == page.label && userInfo) {
					const Page = page.component;
					return <Page key={page.label} userInfo={userInfo} />;
				}
			}
		}
	}
	const renderAdmin = () => {
		setCurrentPage('ADMIN')
	}
	useEffect(() => {
		const pageName = (router.query.page + '').toUpperCase();
		if (pageName) {
			pages.forEach(page => {
				if (page.label == pageName) {
					setCurrentPage(pageName);
					return;
				}
			});
		}
	}, [router.query])

	useEffect(() => {
		if (!showVerificationModal) {
		}
	}, [showVerificationModal])

	useEffect(() => {
		if (userInfo) {
			setProgressList(userInfo.badges)
			setBadgesList(badgesData)
		}
	}, [userInfo])

	const openLink = ()=>{
		if (isMobileDevice()) {
			if (userInfo?._id) {
				window.open(`hatchysurvivors://login?token=${getToken()}&userId=${userInfo._id}`);
			}
		} else {
			window.open("https://discord.gg/ctuYMfXX", "_blank");
		}
	}

	const renderInitialMessage = () => {
		if (userInfo) return <></>
		if (loadingLogging)
			return (
				<div className='flex flex-col justify-center items-center py-48 '>
					<span className='text-white pb-5 font-bold text-center w-52'>Logging in ...</span>
				</div>
			)
		if (loadingData)
			return (
				<div className='flex flex-col justify-center items-center py-48 '>
					<span className='text-white pb-5 font-bold text-center w-52'>Loading info...</span>
				</div>
			)

		return (
			<div className='flex flex-col justify-center items-center py-48 '>
				<span className='text-white pb-5 font-bold text-center w-52'>Please Login to see your account info</span>
				<Button onClick={login} color='green' label={'LOG IN'} />
			</div>
		)
	}
	const renderBadges = () => {
		if (badgesList && progressList) {
			const badge: BadgeProgress = progressList['leafMaster'];
			//const badgeData = badgesList.find(badgeData => badgeData.id == badge.id);
			return (
				Array.from(Array(4).keys()).map((i) => {
					const badgeData = badgesList[i + 7];
					return (badgeData && badge.unlocked &&
						<div className="m-auto w-12 h-12 relative lg:w-16 lg:h-16"
							key={i}
						>
							<Image src={`/static/badges/${badgeData?.propertyName}.png`}
								alt="egg"
								objectFit='cover'
								layout='fill' />
						</div>
					)
				})
			)
		}
	}
	if (isActivating) {
		return (
			<PageLayout className='bg-purple-image bg-cover pt-20'>
				<LoadingSpinnerPage />
			</PageLayout>
		);
	}

	if (!isConnected) {
		return (
			<PageLayout className='bg-kingdom bg-cover'>
				<div className='min-h-full flex flex-col justify-center items-center py-40'>
					<span className='text-xl mb-5'>Your wallet is not connected.</span>
					<div className='mb-5'>
						<Image src={'/static/cards/gen1/plant/florean.gif'} alt='Florean' width={200} height={200} />
					</div>
					<ConnectWalletModalWrapper />
				</div>
			</PageLayout>
		);
	} else {
		return (
			<PageLayout className='bg-purple-image bg-cover pt-20'>
				{isProcessing && <LoadingModal />}
				<Banner title='Account' />
				<BadgesModal isOpen={showBadgesModal} closeModal={closeBadgesModal} setBadges={setBadges} userInfo={userInfo} />
				{userInfo && userInfo.email != "" &&
					<VerificationModal isOpen={showVerificationModal} closeModal={closeVerificationModal} email={userInfo.email} />
				}
				{userInfo &&
					<>
						<EditAccountModal isOpen={showEditModal} closeModal={closeEditModal}
							userInfo={userInfo} setUserInfo={setUserInfo} openVerificationModal={openVerificationModal} />
						<EditAvatarModal isOpen={showEditAvatarModal} closeModal={closeEditAvatarModal} userInfo={userInfo} setUserInfo={setUserInfo} />
					</>
				}
				{renderInitialMessage()}
				{userInfo &&
					<>
						<section className='w-full flex flex-col justify-center items-center pb-10 px-5 text-gray-dark2'>
							<ShareReferalLinkModal isOpen={showShareLinkModal} closeModal={() => setShowShareLinkModal(false)} userId={userInfo._id} />
							{showSurvivorsBanner &&
								<div className='flex flex-row justify-center items-center max-w-xl w-full py-1
									md:max-w-xl lg:max-w-5xl card-frame border-white text-white bg-whit bg-opacity-40
									bg-kingdom bg-center bg-cover mb-5 group hover:cursor-pointer'
									onClick={openLink}
								>
									<div className='flex flex-row justify-center w-5 h-5 items-center
									absolute top-2 right-2 z-10'>
										<button onClick={(e)=>{
											e.stopPropagation();
											setShowSurvivorsBanner(false)
										}}>
											<Icon icon={"carbon:close"} width={30} />
										</button>
									</div>
									<div className='font-bold text-3xl flex flex-col justify-center items-center
									w-auto pl-5 text-center
									lg:text-5xl'>
										<span className='bg-gray-dark2 bg-opacity-50 px-5 py-2 border-2 border-white
										'>
										{/*group-hover:text-yellow transition-colors ease-in-out duration-300 */}
											COMING SOON
										</span>
									</div>
									<div className='w-48 flex justify-center items-center'>
										<div className='w-full h-32 relative flex justify-center items-center'>
											<Image src={"/hatchy_survivors.png"} alt='hatchy survivors logo' layout='fill' objectFit='contain' />
										</div>
									</div>
								</div>
							}
							<div className='flex flex-col justify-center items-center max-w-xl w-full py-7
						md:max-w-xl lg:max-w-5xl card-frame border-white text-white bg-whit bg-opacity-40'>
								<div className='w-full flex flex-col items-center md:flex-row space-y-10 md:space-y-0'>
									{/**Profile Picture */}
									<div className='w-full md:w-1/2 lg:w-1/3'>
										<div className="m-auto pixelate w-40 h-40 border-2 border-white relative rounded-full overflow-hidden" onMouseEnter={() => setIsPictureHover(true)} onMouseLeave={() => setIsPictureHover(false)}>
											{isPictureHover &&
												<button className='absolute flex flex-col justify-center items-center h-full w-full bg-black bg-opacity-40 z-40'
													onClick={openEditAvatarModal}>
													<Icon icon="ant-design:camera-outlined" className='h-1/2' width={40} />
													<span className='h-1/2' >Customize</span>
												</button>
											}
											<div className='relative w-40 h-40 z-30'>
												{userInfo.avatar ?
													<Image src={`${ACCOUNTS_IMAGES_URL}/${userInfo.avatar}`}
														alt="egg"
														layout='fill'
														objectFit='cover' />
													:
													<Image src={"/static/egg.gif"} alt="egg" layout='fill' />
												}
											</div>
										</div>
										<div className='flex justify-center text-center mt-2 font-bold text-xl text-yellow'>
											{userInfo.username == '' ?
												<div className='flex items-center'>
													<span className='text-xl px-2'>Username</span>
													<button className='font-bold underline' onClick={openEditModal} >
														<Icon icon="akar-icons:edit" width={25} />
													</button>
												</div>
												:
												userInfo.username
											}
										</div>
										<div className='flex justify-center text-center'>
											ID: {userInfo._id}
										</div>
									</div>
									<div className='w-full space-y-10 flex flex-col md:w-1/2 lg:space-y-0 lg:flex-row lg:w-2/3'>
										{/**Referrals*/}
										<div className='w-full flex flex-col justify-center items-center space-y-2'>
											<div className='flex space-x-2'>
												<Button label='Share referral link' color='cyan' onClick={() => setShowShareLinkModal(true)} />
											</div>
											{/* <span>Rank #{12345678}</span> */}
											<span className='text-3xl font-black flex justify-center items-center'>
												{userInfo.referrals ? userInfo.referrals.length : '00'} REFERRALS
											</span>
										</div>
										{/**Badges*/}
										<div className={`w-full flex flex-col justify-center items-center
										${progressList ? 'visible' : 'invisible'}`}>
											<div className='flex flex-row border rounded-full bg-black bg-opacity-40
											 border-white bg-opacity- text-white p-2 space-x-2'>
												{renderBadges()}
											</div>
											{userInfo.points &&
												<span>{userInfo.points}</span>
											}
											<div className='flex flex-col space-x-2'>
												<span className='text-2xl font-bold'>BADGES</span>
												<div className='flex flex-row space-x-3 justify-center items-center text-yellow'>
													<span className='text-xl'>Edit</span>
													<button onClick={openBadgesModal} className="hover:text-gray-300 transition-colors">
														<Icon icon="akar-icons:edit" width={25} />
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='flex flex-col mt-5 w-full px-8 space-y-3'>
									<div className=''>
										<div className='flex flex-row items-center'>
											<span className='font-bold mr-2'>EMAIL: </span>
											{userInfo.email == '' ?
												<span className='text-yellow'>
													<button className='font-bold underline' onClick={openEditModal} >Click to add your email</button>
												</span>
												:
												<span>{userInfo.email}</span>
											}
											{userInfo.email_verify === 1 &&
												<Icon icon="material-symbols:verified-rounded" width={25} className='text-green ml-2' />
											}
										</div>
										{userInfo.email_verify === 0 &&
											<span className='text-yellow font-bold'>(Please verify your email)</span>
										}
									</div>
									<div className='flex space-x-2 items-center'>
										<span className='text-xs font-bold'>Email visibility:</span>
										<div className='flex flex-row items-center'>
											<EmailVisibilitySelect userInfo={userInfo} setUserInfo={setUserInfo} />
										</div>
									</div>
									<div >
										<span className='font-bold'>BIO:</span>
										{userInfo.bio == '' ?
											<span className='text-yellow'>
												<button className='font-bold underline ml-2' onClick={openEditModal} > Click to add a bio</button>
											</span>
											:
											<p>
												{userInfo.bio}
											</p>
										}
									</div>
									<div className='flex justify-center'>
										<Button label='EDIT PROFILE' onClick={openEditModal} />
									</div>
								</div>
							</div>
						</section>
						<section className='w-full flex flex-col justify-center items-center pb-5 px-5'>
							<div className='flex flex-col justify-center items-center w-full
							md:space-y-0
							lg:max-w-5xl '>
								<div className='flex flex-row justify-start items-start w-full space-x-1'>
									{pages.map(page => (
										<button key={page.label} className={`${currentPage === page.label ? 'bg-white  ' : 'bg-white bg-opacity-40 '}
										py-1 rounded-t-sm text-xs px-1 sm:px-2 sm:text-base font-bold`}
											onClick={() => setCurrentPage(page.label)}>
											{page.label}
										</button>
									))}
									{
										userInfo.privilege === 1 &&
										<button key='ADMIN' className={`${currentPage === 'ADMIN' ? 'bg-white  ' : 'bg-white bg-opacity-40 '}
									py-1 rounded-t-sm text-xs px-1 sm:px-2 sm:text-base font-bold`}
											onClick={() => setCurrentPage('ADMIN')}>
											ADMIN
										</button>
									}
								</div>
								{renderPage()}
							</div>
						</section>
						<div className='w-full flex justify-center items-center'>
							<Button onClick={logout} color='red' label={'LOG OUT'} />
						</div>
					</>
				}
			</PageLayout >
		)
	}
}

export default AccountPage