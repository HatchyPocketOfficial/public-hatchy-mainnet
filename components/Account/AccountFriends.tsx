import { Icon } from '@iconify/react'
import React, { useState, useEffect } from 'react'
import { FriendModel } from '../../types';
import Input from '../Input'
import { useAccount } from '../../contexts/AccountContext';
import { displayError, displaySuccess } from '../../utils/ErrorMessage';
import useAccountFriends from '../../hooks/Accounts/useAccountFriends';
import UserCard from './UserCard';
import FriendRequestModal from './FriendRequestModal';
import BlockListModal from './BlockListModal';

export default function AccountFriends() {
	const [updater, setUpdater] = useState<Date>();
	const [search, setSearch] = useState('');
	const [addFriendAddress, setAddFriendAddress] = useState('');
	const [page, setPage] = useState(0);
	const [friendRequestSent, setFriendRequestSent] = useState(false)
	const rowsPerPage = 3;
	const { userInfo, setUserInfo, friendsList, blockList, updateFriendsInfo } = useAccount();

	const [showFriendRequestModal, setShowFriendRequestModal] = useState(false)
	const closeFriendRequestModal = () => setShowFriendRequestModal(false)

	const [showBlockListModal, setShowBlockLisModal] = useState(false)
	const closeBlockListModal = () => setShowBlockLisModal(false)

	const { sendFriendRequest } = useAccountFriends(userInfo?._id);
	const [friends, setFriends] = useState<FriendModel[]>([]);
	const [receivedRequests, setReceivedRequests] = useState<FriendModel[]>([]);
	const [sentRequests, setSentRequests] = useState<FriendModel[]>([]);

	useEffect(() => {
		const interval = setInterval(() => setUpdater(new Date()), 65 * 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (friendsList && friendsList.length > 0) {
			const receivedRequestsS = friendsList.filter((friend) => {
				return friend.friendMode == 'receive'
			})
			setReceivedRequests(receivedRequestsS);

			const sentRequestsS = friendsList.filter((friend) => {
				return friend.friendMode == 'send'
			})
			setSentRequests(sentRequestsS);

			const friendsS = friendsList?.filter((friend) => {
				return friend.friendMode == 'friend'
			})
			setFriends(friendsS)
		}
	}, [friendsList])

	const addFriend = () => {
		const newaddFriendAddress = addFriendAddress.trim();
		if (newaddFriendAddress != '') {
			sendFriendRequest(addFriendAddress).then((res) => {
				if (res?.data.code == 200) {
					setAddFriendAddress('');
					displaySuccess('Friend request sent successfully');
					updateFriendsInfo();
				} else {
					displayError("An error ocurred")
				}
			})
		}
	};

	const searchFriend = () => {
		console.log('search friend with address: ' + search);
	}
	const changePage = (change: number) => {
		const newPage = page + change < 0 ? 0 : page + change;
		setPage(newPage);
	}
	const messageFriend = (address: string) => {

	}
	const removeFriend = (address: string) => {

	}

	const renderList = () => {
		const startIndex = page * rowsPerPage;

		if (friends && friends.length > 0) {
			return (
				<div className='p-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 pb-2' >
					{
						friends?.slice(startIndex, startIndex + rowsPerPage).map(friend => (
							// friends?.map(friend => (
							<UserCard userCardInfo={friend} isFriend={true} key={friend._id} />
						))
					}
				</div>
			)
		} else {
			return (
				<span className='text-2xl p-4 '>You don{"'"}t have any friend yet!</span>
			)
		}
	}

	return (
		<div className='w-full border-4 border-white text-white py-2 px-4'>
			{showFriendRequestModal &&
				<FriendRequestModal
					isOpen={showFriendRequestModal}
					closeModal={closeFriendRequestModal}
					receivedRequests={receivedRequests}
					sentRequests={sentRequests}
					userInfo={userInfo} />
			}
			{showBlockListModal &&
				<BlockListModal
					isOpen={showBlockListModal}
					closeModal={closeBlockListModal}
					blockList={blockList}
					userInfo={userInfo} />
			}
			{/* <div className={` w-full flex flex-row my-3 justify-end `}> */}
			{/* {
					friends && friends.length > 0 &&
					<span className='text-lg'>Friends List ({friends?.length}/{friends?.length})</span>
				} */}
			<div className='flex flex-col justify-center lg:flex-row space-y-2 items-center lg:space-x-6'>
				<button onClick={() => setShowFriendRequestModal(true)} className='flex items-center hover:bg-white hover:bg-opacity-25'>
					<Icon icon="ant-design:user-outlined" className='h-full' width={25} />
					<span className='text-lg'>Friend Requests ({receivedRequests?.length})</span>
				</button>
				<div className='flex flex-col '>
					<div className='flex flex-row justify-center items-center space-x-0 h-7'>
						<Input placeholder='Enter name/address' value={addFriendAddress} onChange={setAddFriendAddress}
							styleType='transparency' className='w-auto md:w-52 h-full' />
						<button onClick={() => addFriend()} className='bg-white bg-opacity-25 h-full ' >
							<Icon icon="ant-design:user-add-outlined" width={26} />
						</button>
					</div>
				</div>
				<div className='flex flex-row justify-center items-center space-x-0 h-7'>
					<Input placeholder='Search in Friends List' value={search} onChange={setSearch} styleType='transparency' className='h-full' />
					<button onClick={() => searchFriend()} className='bg-white bg-opacity-25 h-full pl-1'>
						<Icon icon="akar-icons:search" width={20} />
					</button>
				</div>
			</div>
			{/* </div> */}
			<div className='w-full flex justify-center '>
				{renderList()}
			</div>
			<div className='w-full flex flex-row justify-between mt-3'>
				<div className='flex flex-row'>
					<button onClick={() => changePage(-1)}
						className={`${page > 0 ? 'flex' : 'invisible'}`}>
						<Icon icon="ic:round-navigate-before" width={35} />
					</button>
					{friends &&
						<button onClick={() => changePage(1)}
							className={`${page + 1 < Math.ceil(friends.length / rowsPerPage) ? 'flex' : 'invisible'}`}>
							<Icon icon="ic:round-navigate-next" width={35} />
						</button>
					}
				</div>
			</div>
			<div className='flex justify-end'>

				<button onClick={() => setShowBlockLisModal(true)} className='flex items-center hover:bg-white hover:bg-opacity-25'>
					<Icon icon="bx:user-x" width={35} />
					<span className='text-lg'>	Block users ({blockList?.length})</span>
				</button>
			</div>

		</div>
	)
}
