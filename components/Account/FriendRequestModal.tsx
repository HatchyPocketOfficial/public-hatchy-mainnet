import { Icon } from '@iconify/react';
import React, { useState } from 'react'
import { FriendModel, UserModel } from '../../types';
import Banner from '../Banner';
import Modal, { ModalProps } from '../Modal'
import useAccountFriends from '../../hooks/Accounts/useAccountFriends';
import { displayError, displaySuccess } from '../../utils/ErrorMessage';
import FriendRequestCard from './FriendRequestCard';
import { useAccount } from '../../contexts/AccountContext';

interface FriendRequestModal extends ModalProps {
	receivedRequests: FriendModel[] | undefined
	sentRequests: FriendModel[] | undefined
	userInfo: UserModel | undefined
}

export default function FriendRequestModal({ receivedRequests, sentRequests, userInfo, ...modalProps }: FriendRequestModal) {
	const { acceptFriendRequest, declineFriendRequest } = useAccountFriends(userInfo?._id);
	const [selectedAcceptRequest, setSelectedAcceptRequest] = useState(-1)
	const [selectedDeclineRequest, setSelectedDeclineRequest] = useState(-1)
	const { updateFriendsInfo } = useAccount();

	const acceptRequest = (friend_id: string, i: number) => {
		if (!receivedRequests) return;
		acceptFriendRequest(friend_id).then((res) => {
			if (res?.data.code == 200) {
				displaySuccess(`Great, now ${receivedRequests[i].username} is your friend!`)
				updateFriendsInfo();
				setSelectedAcceptRequest(i);
				setTimeout(() => {
					setSelectedAcceptRequest(-1)
				}, 2500)
			} else {
				displayError(res?.data.message)
			}
		})
	}
	const declineRequest = (friend_id: string, i: number) => {
		declineFriendRequest(friend_id).then((res) => {
			if (res?.data.code == 200) {
				displaySuccess(`Request declined`)
				updateFriendsInfo();
				setSelectedDeclineRequest(i);
				setTimeout(() => {
					setSelectedDeclineRequest(-1)
				}, 2500)
			} else {
				displayError(res?.data.message)
			}
		})
	}

	const renderList = () => {
		return (
			<>
				<h2>Received Friend Requests</h2>
				<div className='flex flex-col max-h-72 space-y-2 overflow-y-auto'>
					{
						receivedRequests && receivedRequests?.length > 0 ?
							receivedRequests?.map((friend, i) => (
								<FriendRequestCard key={i}
									index={i} friend={friend}
									showFriendMessage={selectedAcceptRequest === i}
									showCompleteMessage={selectedDeclineRequest === i}
									acceptRequest={acceptRequest}
									declineRequest={declineRequest} />
							))
							:
							<div className='flex justify-center'>
								<span className='text-white font-bold text-lg'>Here you will see your friend requests</span>
							</div>
					}
				</div>
				{sentRequests && sentRequests?.length > 0 &&
					<>
						<h2>Sent Friend Requests</h2>
						<div className='flex flex-col max-h-72 space-y-2 overflow-y-auto'>
							{sentRequests.map((friend, i) => (
								<FriendRequestCard key={i} index={i} friend={friend} />
							))
							}
						</div>
					</>
				}
			</>

		)
	}
	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-full max-w-lg text-white '>
			<div className='flex justify-end w-full  absolute top-1 right-1 '>
				<button onClick={modalProps.closeModal}>
					<Icon icon={"carbon:close"} width={30} />
				</button>
			</div>
			<Banner title='Friend Requests' white />
			<div className='flex flex-col space-y-2'>
				{renderList()}
			</div>

		</Modal>
	)
}
