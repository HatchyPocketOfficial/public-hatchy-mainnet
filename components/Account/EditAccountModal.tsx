import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { useStake } from '../../contexts/StakeContext';
import useEditAccount from '../../hooks/Accounts/useEditAccount';
import { UserModel } from '../../types';
import { displayError } from '../../utils/ErrorMessage';
import Banner from '../Banner';
import Button from '../Button';
import Input from '../Input'
import Modal, { ModalProps } from '../Modal';
import TextArea from '../TextArea';

interface EditAccountModal extends ModalProps {
	userInfo: UserModel,
	setUserInfo: (user: UserModel) => void,
	openVerificationModal: () => void,

}

export default function EditAccountModal({ userInfo, setUserInfo, openVerificationModal, ...modalProps }: EditAccountModal) {
	const [editUsernameField, setEditUsernameField] = useState(userInfo.username);
	const [editEmailField, setEditEmailField] = useState(userInfo.email);
	const [editBioField, setEditBioField] = useState(userInfo.bio);
	const [editReferedField, setEditReferedField] = useState(userInfo.referrer);
	const { updateField, updateReferral } = useEditAccount(userInfo._id);
	const { stakedMetadatas } = useStake()

	useEffect(() => {
		if (modalProps.isOpen) {
			setEditUsernameField(userInfo.username);
			setEditEmailField(userInfo.email);
			setEditBioField(userInfo.bio);
			setEditReferedField(userInfo.referrer)
		}
	}, [userInfo, modalProps.isOpen])

	const updateData = () => {
		const newBio = editBioField.trim();
		if (newBio !== userInfo.bio) {
			updateField(newBio, 'bio').then((res) => {
				//if(res?.data.message=='Failed to verify the token')	Router.push('/account');
				if (res?.data.code == 200) {
					setUserInfo(res.data.data);
				} else {
					displayError(res?.data.message)
				}
			})
		}

		const newUsername = editUsernameField.trim();
		if (newUsername !== userInfo.username && newUsername !== "") {
			updateField(newUsername, 'username').then((res) => {
				if (res?.data.code == 200) {
					setUserInfo(res.data.data);
				} else {
					displayError(res?.data.message)
				}
			})
		}

		const newEmail = editEmailField.trim();
		if (newEmail !== userInfo.email && newEmail !== "") {
			updateField(newEmail, 'email').then((res) => {
				if (res?.data.code == 200) {
					setUserInfo(res.data.data);
					openVerificationModal();
				} else {
					displayError(res?.data.message)
				}
			})
		}

		const newReferrer = editReferedField.trim();
		if (newReferrer !== userInfo.referrer && newReferrer !== "" && newReferrer !== userInfo._id) {
			updateReferral(newReferrer).then((res) => {
				if (res?.data.code == 200) setUserInfo(res.data.data)
				else displayError(res?.data.message)
			})
		}
		modalProps.closeModal();
	}
	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-full max-w-md text-white'>
			<div className='flex justify-end w-full  absolute top-1 right-1 '>
				<button onClick={modalProps.closeModal}>
					<Icon icon={"carbon:close"} width={30} />
				</button>
			</div>
			<Banner title='Edit Account' />
			<div className='w-full py- px-7  h-full'>
				<div className='w-full flex flex-col my-3'>
					<span className='font-bold'>USERNAME:</span>
					<Input value={editUsernameField} onChange={setEditUsernameField} styleType='transparency' />
				</div>
				<div className='w-full flex flex-col my-3'>
					<span className='font-bold'>EMAIL:</span>
					<Input value={editEmailField} onChange={setEditEmailField} styleType='transparency' />
				</div>
				<div className='w-full relative'>
					<span className='font-bold'>BIO:</span>
					<TextArea value={editBioField} onChange={(e) => setEditBioField(e.target.value)} />
				</div>
				{stakedMetadatas && !(stakedMetadatas.length > 0) && userInfo.referrer == '' &&

					<div className='w-full flex flex-col my-3'>
						<span className='font-bold'>REFERED BY:</span>
						<Input value={editReferedField} onChange={setEditReferedField} styleType='transparency' />
					</div>
				}
				<div className='w-full flex justify-center items-center my-2 space-x-4'>
					<Button onClick={updateData} color='green' label={'SAVE'} />
				</div>
			</div>
		</Modal>
	)
}
