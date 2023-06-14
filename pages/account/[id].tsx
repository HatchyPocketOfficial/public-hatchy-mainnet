import { useWeb3React } from '@web3-react/core'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import LoadingModal from '../../components/LoadingModal'
import PageLayout from '../../components/PageLayout'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import AccountProgress from '../../components/Account/AccountProgress'
import BadgesModal from '../../components/Account/BadgesModal'
import { Badge, UserModel, FriendModel, BadgeObject } from '../../types'
import { useAccount } from '../../contexts/AccountContext'
import { useRouter } from 'next/router'
import { displaySuccess } from '../../utils/ErrorMessage'
import { ACCOUNTS_IMAGES_URL } from '../../constants'
import ShareReferalLinkModal from '../../components/Account/ShareReferralLinkModal'
import Link from 'next/link'
import { badgesData } from '../../constants/badgesData';
import ConnectWalletModalWrapper from '../../components/WalletConnect/ConnectWalletModalWrapper'
import { shortenHex } from '../../utils/numberFormatterHelper'
import Button from '../../components/Button'
import Router from 'next/router'

const AccountPage: NextPage = () => {
	const userId = useRouter().query.id as string;
	const [userInfoA, setUserInfoA] = useState<UserModel>();
	const [friends, setFriends] = useState<FriendModel[]>([]);
	const [isFriend, setIsFriend] = useState(false)
	//account Data
	const { getUserInfo, friendsList } = useAccount();
	const [referrals, setReferrals] = useState<UserModel[]>([])


	const router = useRouter();
	const [currentPage, setCurrentPage] = useState('MY PROGRESS');
	const { account, provider: library } = useWeb3React();
	const isConnected = typeof account === "string" && !!library;

	//share modal
	const [showShareLinkModal, setShowShareLinkModal] = useState(false);

	const [isPictureHover, setIsPictureHover] = useState(false)

	/*Loading */
	const [isProcessing, setIsProcessing] = useState(false);

	const [showBadgesModal, setShowBadgesModal] = useState(false);
	const openBadgesModal = () => setShowBadgesModal(true);
	const closeBadgesModal = () => setShowBadgesModal(false);
	const [badgesList, setBadgesList] = useState<Badge[]>()
	const [progressList, setProgressList] = useState<BadgeObject>()
	const [isCopied, setIsCopied] = useState(false)
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

	const copyText = () => {
		if (!isCopied && userInfoA) {
			navigator.clipboard.writeText(userInfoA?.address);
			setIsCopied(true)
			displaySuccess('Address copied!');
			setTimeout(() => {
				setIsCopied(false)
			}, 5000)
		}
	}

	useEffect(() => {
		if (userInfoA) {
			setProgressList(userInfoA.badges)
			setBadgesList(badgesData)
			setReferrals(userInfoA.referrals)
		}
	}, [userInfoA])

	const pages = [
		{
			label: 'MY PROGRESS',
			component: AccountProgress
		}
	];

	const renderPage = () => {
		for (let i = 0; i < pages.length; i++) {
			const page = pages[i];
			if (currentPage == page.label && userInfoA) {
				const Page = page.component;
				if (currentPage == 'MY PROGRESS') return <Page key={page.label} userInfo={userInfoA} isFriend={true} />;
				return <Page key={page.label} userInfo={userInfoA} />;
			}
		}
	}

	useEffect(() => {
		getUserInfo(userId).then(data => {
			setUserInfoA(data);
		})
	}, [userId]);

	useEffect(() => {
		if (friendsList && friendsList.length > 0) {
			const friendsS = friendsList.filter(friend => {
				return friend.friendMode == 'friend'
			})
			setFriends(friendsS)
		}
	}, [friendsList])

	useEffect(() => {
		if (userInfoA && friends) {
			if (friends.length > 0) {
				friends.find(friend => {
					if (friend._id == userInfoA._id) setIsFriend(true)
				})
			}
		}
	}, [userInfoA, friends])

	const displaySuccessMessage = () => {
		displaySuccess('Info saved');
	}

	const renderInitialMessage = () => {
		if (userInfoA) return <></>
		return (
			<div className='flex flex-col justify-center items-center py-48 '>
				<span className='text-white pb-5 font-bold text-center w-52'>Loading info...</span>
			</div>
		)
	}


	if (!isConnected) {
		return (
			<PageLayout className='bg-kingdom bg-cover'>
				<div className='min-h-full flex flex-col justify-center items-center py-40'>
					<span className='text-whit text-9xl py-10'>:(</span>
					<ConnectWalletModalWrapper />
				</div>
			</PageLayout>
		);
	} else {
		return (
			<PageLayout className='bg-purple-image bg-cover'>
				{isProcessing && <LoadingModal />}
				<BadgesModal isOpen={showBadgesModal} closeModal={closeBadgesModal} setBadges={setBadges} />
				{renderInitialMessage()}
				{userInfoA &&
					<>
						<section className='w-full flex flex-col justify-center items-center pb-6 px-5 text-gray-dark2 mt-8'>
							<ShareReferalLinkModal isOpen={showShareLinkModal} closeModal={() => setShowShareLinkModal(false)} userId={userInfoA._id} />
							{/* Title and back button */}
							<div className='flex w-full max-w-4xl justify-start items-center py-10
							text-white text-xl font-bold '>
								<Link href={`/account`} >
									<a className='flex flex-row items-center text-xl visible'>
										<Icon icon="bx:left-arrow-alt" width={40} />
										Account
									</a>
								</Link>
							</div>
							<div className='flex flex-col justify-center items-center max-w-xl w-full py-7
						md:max-w-xl lg:max-w-5xl card-frame border-white text-white bg-whit bg-opacity-40'>
								<div className='w-full flex flex-col items-center md:flex-row space-y-10 md:space-y-0'>
									{/**Profile Picture */}
									<div className='w-full md:w-1/2 lg:w-1/3'>
										<div className="m-auto pixelate w-40 h-40 border-2 border-white relative rounded-full overflow-hidden" onMouseEnter={() => setIsPictureHover(true)} onMouseLeave={() => setIsPictureHover(false)}>
											<div className='relative w-40 h-40 z-30'>
												{userInfoA.avatar ?
													<Image src={`${ACCOUNTS_IMAGES_URL}/${userInfoA.avatar}`}
														alt="egg"
														layout='fill'
														objectFit='cover' />
													:
													<Image src={"/static/egg.gif"} alt="egg" layout='fill' />
												}
											</div>
										</div>
										<div className='flex justify-center text-center mt-2 font-bold text-xl text-yellow'>
											{userInfoA.username == '' ?
												<div className='flex items-center'>
													<span className='text-xl px-2'>Username</span>
												</div>
												:
												userInfoA.username
											}
										</div>
										<div className='flex justify-center text-center'>
											ID: {userInfoA._id}
										</div>
									</div>
									<div className='w-full space-y-10 flex flex-col md:w-1/2 lg:space-y-0 lg:flex-row lg:w-2/3'>
										{/**Referrals*/}
										<div className='w-full flex flex-col justify-center items-center space-y-2'>
											<div className='flex space-x-2'>
												<span className='text-yellow font-0 '>
													{`User Address ${shortenHex(userInfoA.address)}`}
												</span>
												{isCopied ?
													<div className='flex flex-row'>
														<Icon icon="akar-icons:check" className='text-yellow' width={20} onClick={copyText} />
													</div>
													:
													<Icon icon="akar-icons:copy" className='text-yellow hover:cursor-pointer' width={20} onClick={copyText} />
												}
											</div>
											<span className='text-yellow font-0 '>
												{`User ${userId}`}
											</span>
											{/* <span>Rank #{12345678}</span> */}
											<span className='text-6xl font-black'>{referrals ? referrals.length : '00'}</span>
											<span className='text-2xl font-bold mb-2'>REFERRALS</span>
											<Button label='View wallet' color='cyan'
											onClick={() => Router.push(`/address/${userInfoA.address}`)}
											/>
										</div>



										{/**Badges*/}
										<div className={`w-full flex flex-col justify-center items-center \
										${progressList ? 'visible' : 'invisible'}`}>
											<div className='flex flex-row border border-white bg-opacity- text-white p-2 space-x-2'>
												{Array.from(Array(4).keys()).map((i) => {
													return <Icon icon="mdi:police-badge" key={i} width={40} />
												})}
											</div>
											<span>+{12345678}</span>
											<div className='flex flex-col space-x-2'>
												<span className='text-2xl font-bold'>BADGES</span>
											</div>
										</div>
									</div>
								</div>
								<div className='flex flex-col mt-5 w-full px-8 space-y-3'>
									<div className=''>
										<div className='flex flex-row items-center'>
											{userInfoA.email_status == 2 ?
												<>
													<span className='font-bold mr-2'>EMAIL: </span>
													<span >{userInfoA.email}</span>
													{userInfoA.email_verify === 1 &&
														<Icon icon="material-symbols:verified-rounded" width={25} className='text-green ml-2' />
													}

												</>
												:
												userInfoA.email_status == 1 && isFriend &&
												<>
													<span className='font-bold mr-2'>EMAIL: </span>
													<span >{userInfoA.email}</span>
													{userInfoA.email_verify === 1 &&
														<Icon icon="material-symbols:verified-rounded" width={25} className='text-green ml-2' />
													}
												</>
											}
											{/* {userInfoA.email_status == 1 && isFriend &&
												<span className='font-bold mr-2'>EMAIL: </span>
											}
											{userInfoA.email != '' && userInfoA.email_status == 1 && isFriend &&
												<span >{userInfoA.email}</span>
											}
											{userInfoA.email_verify === 1 && userInfoA.email_status == 1 && isFriend &&
												<Icon icon="material-symbols:verified-rounded" width={25} className='text-green ml-2' />
											} */}
										</div>
									</div>
									<div >
										<span className='font-bold'>BIO:</span>
										{userInfoA.bio == '' ?
											<span className='text-yellow'>
											</span>
											:
											<p>
												{userInfoA.bio}
											</p>
										}
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
								</div>
								{renderPage()}
							</div>
						</section>
						{/* <div className='w-full flex justify-center items-center'>
							<Button onClick={logout} color='red' label={'LOG OUT'} />
						</div> */}
					</>
				}
			</PageLayout >
		)
	}
}

export default AccountPage