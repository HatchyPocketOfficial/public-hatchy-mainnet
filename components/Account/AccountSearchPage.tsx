import React, { useState } from 'react'
import { UserModel } from '../../types';
import Input from '../Input'
import { useAccount } from '../../contexts/AccountContext';
import { displayError, displaySuccess } from '../../utils/ErrorMessage';
import UserCard from './UserCard';
import Button from '../Button';
import useSearchUsers from '../../hooks/Accounts/useSearchUsers';
import useAccountFriends from '../../hooks/Accounts/useAccountFriends';

export default function AccountSearchPage() {
	const [searchInput, setSearchInput] = useState('');
	const [searchResult, setSearchResult] = useState<UserModel[]>();
	const [page, setPage] = useState(0);
	const { userInfo, setUserInfo, updateFriendsInfo } = useAccount();
	const { sendFriendRequest } = useAccountFriends(userInfo?._id);
	const { search } = useSearchUsers();
	const rowsPerPage = 3;

	const searchUsers = () => {
		const searchKey = searchInput.trim();
		if (searchKey != '') {
			search(searchKey).then((res) => {
				if (res?.data.code == 200) {
					setSearchResult(res.data.data);
				} else {
					console.log(res);
					displayError(res?.data.message)
				}
			})
		} else {
			displayError('Empty search');
		}
	};

	const addFriend = (receiverId: string) => {
		if (userInfo) {
			sendFriendRequest(receiverId).then((res) => {
				if (res?.data.code == 200) {
					displaySuccess('Friend request sent successfully');
					updateFriendsInfo();
				} else {
					displayError(res?.data.message)
				}
			})
		}
	};

	const changePage = (change: number) => {
		const newPage = page + change < 0 ? 0 : page + change;
		setPage(newPage);
	}


	const renderSearchList = () => {
		if (!searchResult) return <></>;
		/*
			const startIndex = page * rowsPerPage;
			return searchResult.slice(startIndex, startIndex + rowsPerPage).map(user => (
		*/
		if (searchResult.length > 0) {
			return (
				<div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 pb-2'>
					{searchResult.map(user => (
						<UserCard userCardInfo={user} key={user._id} addFriend={() => addFriend(user._id)} />
					))
					}
				</div>
			)
		}
		return <span className='font-bold text-center'>No results</span>
		/*
			<button onClick={() => changePage(1)}
				className={`${page + 1 < Math.ceil(searchResult.length / rowsPerPage) ? 'flex' : 'invisible'}`}>
				<Icon icon="ic:round-navigate-next" width={35} />
			</button>
			<div className='w-full flex flex-row justify-between mt-3 h-10'>
				<div className='flex flex-row'>
					<button onClick={() => changePage(-1)}
						className={`${page > 0 ? 'flex' : 'invisible'}`}>
						<Icon icon="ic:round-navigate-before" width={35} />
					</button>
				</div>
			</div>
		*/
	}

	return (
		<div className='w-full border-4 border-white text-white py-4 px-4 '>
			<div className='w-full flex flex-col  justify-between items-center'>
				<span className='font-bold text-center text-xl mb-2'>Find someone by Username</span>
				<div className='flex flex-col justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 w-full max-w-lg'>
					<Input placeholder='Search'
						value={searchInput}
						onChange={setSearchInput}
						styleType='default'
						className='w-full '
						onEnterKeyDown={searchUsers} />
					<Button label='SEARCH' color='green' onClick={searchUsers} />
				</div>
			</div>
			<div className='flex justify-center my-2'>
				{searchResult && searchResult.length > 0 &&
					<span className='text-center max-w-sm'>Found: {searchResult.length} results</span>
				}
			</div>
			<div className='w-full space-y-3 max-h-80 overflow-y-auto flex flex-col mt-2 justify-start items-center '>
				{renderSearchList()}
			</div>
		</div>
	)
}
