import React, { useEffect, useState } from 'react'
import { useAccount } from '../../contexts/AccountContext';
import useAccountFriends from '../../hooks/Accounts/useAccountFriends';
import useAccountReferrals from '../../hooks/Accounts/useAccountReferrals';
import { UserModel } from '../../types';
import { displayError, displaySuccess } from '../../utils/ErrorMessage';
import Button from '../Button';
import Input from '../Input';
import UserCard from './UserCard';

interface AccountGeneral {
	userInfo?: UserModel
}
export default function AccountReferrals() {
	const [referralEmail, setReferralEmail] = useState('');
	const [emailSent, setEmailSent] = useState(false);
	const { userInfo, setUserInfo, updateFriendsInfo } = useAccount();
	const { sendReferralInvitation } = useAccountReferrals(userInfo?._id);
	const [referrals, setReferrals] = useState<UserModel[]>()
	const [page, setPage] = useState(0);
	const rowsPerPage = 3;
	const { sendFriendRequest } = useAccountFriends(userInfo?._id);

	useEffect(() => {
		if (userInfo)
			setReferrals(userInfo.referrals)
	}, [userInfo])

	const sendInvitation = () => {
		sendReferralInvitation(referralEmail)
			.then((res) => {
				if (res?.data.code == 200) {
					setEmailSent(true);
					setTimeout(() => {
						setEmailSent(false)
					}, 6000)
				} else {
					displayError(res?.data.message)
				}
			})
			.catch((e) => {
				console.log(e);
			});
	}


	const addFriend = (receiverId: string) => {
		if (userInfo) {
			sendFriendRequest(receiverId).then(res => {
				if (res?.data.code == 200) {
					displaySuccess('Friend request sent successfully');
					updateFriendsInfo();
				} else {
					displayError(res?.data.message)
				}
			})
		}
	};

	const renderList = () => {
		const startIndex = page * rowsPerPage;

		if (referrals && referrals.length > 0) {
			return (
				<div className='p-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 pb-2' >
					{
						referrals?.slice(startIndex, startIndex + rowsPerPage).map(referral => (
							<UserCard userCardInfo={referral} key={referral._id} addFriend={() => addFriend(referral._id)} />
						))
					}
				</div>
			)
		}
		return (
			<span className='text-2xl p-4 '>You don{"'"}t have any referrals yet!</span>
		)

	}
	return (
		<div className='w-full border-4 border-white  py-2 px-7 text-white h-full'>
			<div className='w-full flex flex-col my-3 justify-center items-center text-center space-y-3'>
				<span className='text-xl font-bold'>Are you having fun with hatchies?</span>
				<span >Lets invite your friends, just write their email and click Send Invitation</span>
				<div className='flex flex-col w-full justify-center items-center space-y-3 sm:flex-row sm:space-y-0 sm:space-x-5'>
					<Input
						value={referralEmail}
						onChange={setReferralEmail}
						className='w-full h-9 text-black'
						placeholder='some_email@email.com' />
					<Button label='Send' className='w-full sm:w-32' color='green' onClick={sendInvitation} />
				</div>
				{emailSent &&
					<span className='text-green font-bold text-lg'>Invitation sent successfully!</span>
				}
			</div>
			<div className='w-full flex flex-col justify-start items-center '>
				<span className='text-xl font-bold'>List of Referrals</span>
				{renderList()}
			</div>
		</div>
	)
}
