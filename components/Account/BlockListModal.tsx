import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Banner from '../Banner'
import Modal, { ModalProps } from '../Modal'
import { FriendModel, UserModel } from '../../types';
import { shortenHex } from "../../utils";
import Image from 'next/image';
import useAccountFriends from '../../hooks/Accounts/useAccountFriends';
import { displayError, displaySuccess } from '../../utils/ErrorMessage';
import { useAccount } from '../../contexts/AccountContext';
import { isOnline } from '../../utils/accounts';

interface BlockListModal extends ModalProps {
	blockList: FriendModel[] | undefined
	userInfo: UserModel | undefined
}

export default function BlockListModal({ blockList, userInfo, ...modalProps }: BlockListModal) {
	const { unblockFriend } = useAccountFriends(userInfo?._id);
	const [selectedRequest, setSelectedRequest] = useState(-1)
	const { updateFriendsInfo } = useAccount();

	const unblock = (friend_id: string, i: number) => {
		unblockFriend(friend_id).then((res) => {
			if (res?.data.code == 200) {
				displaySuccess('User removed from block list');
				updateFriendsInfo();
			} else {
				displayError(res?.data.message)
			}
		})
	}
	const renderList = () => {
		return (
			<div className='overflow-y-auto max-h-96'>
				{
					blockList && blockList.length > 0 ?
						blockList?.map((member, i) => (
							<div className='flex justify-between w-full bg-white bg-opacity-25 my-2 py-4 px-2' key={member._id}>
								<div className='flex flex-row space-x-2 items-center'>
									<div className="relative">
										{member.avatar ?
											<div className="m-auto w-14 h-14 relative rounded-full overflow-hidden bg-purple-400">
												<Image src={`https://account-test.hatchypocket.com/images/${member.avatar}`}
													alt="egg"
													objectFit='cover'
													layout='fill' />
											</div>
											:
											<div className="m-auto pixelate w-14 h-14 relative rounded-full bg-purple-400">
												<Image src={"/static/egg.gif"} alt="egg" layout='fill' />
											</div>
										}
										<div className={`w-3 h-3  rounded-full absolute bottom-0 right-0 
										${isOnline(new Date(member.lastViewedAt)) ? 'bg-green-dark' : 'bg-gray-400'}`} />
									</div>
									<div className='flex flex-col'>
										<span className='font-bold text-lg'>{member.username}</span>
										<span className='text-sm'>Address: {shortenHex(member.address)}</span>
									</div>
								</div>
								<div className='flex space-x-4'>
									<button onClick={() => unblock(member.userId, i)}>
										<Icon icon={"akar-icons:block"} width={32} className='w-16' />
										Unblock
									</button>
								</div>
							</div>
						))
						:
						<span className='font-bold text-lg'>Good! You do not have any blocked members!</span>
				}
			</div>

		)
	}
	return (
		< Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-full max-w-lg text-white' >
			<div className='flex justify-end w-full  absolute top-1 right-1 '>
				<button onClick={modalProps.closeModal}>
					<Icon icon={"carbon:close"} width={30} />
				</button>
			</div>
			<Banner title='Block List' white />
			<div className='flex flex-col space-y-2 justify-center'>
				{renderList()}
			</div>
		</Modal >
	)
}
