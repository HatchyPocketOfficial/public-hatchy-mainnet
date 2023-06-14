import { Icon } from '@iconify/react'
import React from 'react'
import Banner from '../Banner';
import Modal, { ModalProps } from '../Modal';

interface VerificationModalProps extends ModalProps {
	email: string
}

export default function VerificationModal({email, ...modalProps}:VerificationModalProps) {
	
  	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-full max-w-md'>
			<div className='flex justify-end w-full  absolute top-1 right-1 text-white'>
				<button onClick={modalProps.closeModal}>
					<Icon icon={"carbon:close"} width={30} />
				</button>
			</div>
			<Banner title='Verify Email' white />
			<div className='w-full px-7 text-white h-full flex flex-col items-center text-center'>
				<Icon icon="material-symbols:verified-rounded" width={30} className='text-green mb-3' />
				<span className='text-lg mb-4'>
					An email has been sent to 
					<p className='font-bold'>{email}</p>
				</span>
				<p>
					Please click on the button to complete the verification process
				</p>
			</div>
		</Modal>
  	)
}
