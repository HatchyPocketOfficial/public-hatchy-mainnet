import { Icon } from '@iconify/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { ACCOUNTS_IMAGES_URL } from '../../constants'
import useEditAccount from '../../hooks/Accounts/useEditAccount'
import useAdminFunctions from '../../hooks/admin/useAdminFunctions'
import { UserModel, Avatar, Badge } from '../../types'
import { displayError, displaySuccess } from '../../utils/ErrorMessage'
import Banner from '../Banner'
import Modal, { ModalProps } from '../Modal'
import AvatarCard from './AvatarCard'

interface EditAvatarModal extends ModalProps {
	userInfo: UserModel,
	setUserInfo: (user: UserModel) => void,
}

export default function EditAvatarModal({ userInfo, setUserInfo, ...modalProps }: EditAvatarModal) {
	const [avatarList, setAvatarList] = useState<Avatar[]>();
	const [avatarHover, setAvatarHover] = useState<Avatar>();
	const { updateAvatar, fetchAvatarList } = useEditAccount(userInfo._id);
	const { fetchBadgeList } = useAdminFunctions(userInfo);
	const [categoryList, setCategoryList] = useState<string[]>()
	const [badgeList, setBadgeList] = useState<Badge[]>()

	useEffect(() => {
		if (modalProps.isOpen) {
			fetchAvatarList().then((res) => {
				if (res?.data.code == 200) {
					setAvatarList(res.data.data);
				} else {
					displayError(res?.data.message)
				}
			})
			fetchBadgeList().then((res) => {
				if (res?.data.code == 200) {
					setBadgeList(res.data.data);
				} else {
					displayError(res?.data.message);
				}
			})
		}
	}, [modalProps.isOpen])

	useEffect(() => {
		if (avatarList) {
			setAvatarHover(avatarList[0])

			const categorys = avatarList?.map((avatar) => (
				avatar.category
			))
			const setCategorys = new Set(categorys)
			setCategoryList(Array.from(setCategorys))
		}
	}, [avatarList])

	const updateData = (avatar: Avatar) => {
		if (avatar.unlocked && avatar.image != userInfo.avatar) {
			updateAvatar(avatar._id).then((res) => {
				if (res?.data.code == 200) {
					setUserInfo(res.data.data);
					displaySuccess('Avatar changed successfully!')
					modalProps.closeModal();
				} else {
					displayError(res?.data.message)
				}
			})
		}
	}
	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-full max-w-2xl text-white over '>
			<div className='flex justify-end w-full  absolute top-1 right-1 '>
				<button onClick={modalProps.closeModal}>
					<Icon icon={"carbon:close"} width={30} />
				</button>
			</div>
			<Banner title='Edit Avatar Account' />
			<div className='w-full px-7 h-full overflow-y-auto'>
				<div className='w-full flex flex-col my-3 items-center'>

					{avatarList && avatarList.length > 0 ?
						<AvatarCard avatarHover={avatarHover} badgeList={badgeList} />
						:
						<span className='text-2xl font-bold py-2'>No avatars available</span>
					}
					<div className='w-full overflow-y-auto max-h-80 px-2'>
						<div className='w-full py-2 '>
							{categoryList?.map((category) => (
								<div key={category}>
									<span >{category}</span>
									<div className=' border-2 border-white grid grid-cols-2 gap-y-3 gap-x-0 md:grid-cols-3 lg:gap-x-2 lg:grid-cols-6 pb-2 relative max-h-80 bg-white bg-opacity-25 p-2'>
										{
											avatarList && avatarList.length > 0 &&
											avatarList.map((avatar) => (
												avatar.category == category &&
												<div className="m-auto pixelate relative overflow-hidden rounded-full border-2 w-20 h-20 border-white hover:border-red-500 hover:border-2"
													key={avatar._id}
													onMouseEnter={() => { setAvatarHover(avatar) }}>
													{!avatar?.unlocked &&
														<div className='absolute bg-white bg-opacity-30 flex justify-center w-full h-full items-center z-40 text-black'>
															<Icon icon="ant-design:lock-filled" width={50}></Icon>
														</div>
													}
													<button onClick={() => updateData(avatar)} className='relative w-20 h-20'>
														<Image src={`${ACCOUNTS_IMAGES_URL}/${avatar.image}`} alt="egg" objectFit='cover' layout='fill' />
													</button>
												</div>
											))
										}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}
