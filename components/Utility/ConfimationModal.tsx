import { Icon } from '@iconify/react';
import React from 'react'
import Banner from '../Banner';
import Button from '../Button';
import Modal, { ModalProps } from '../Modal'

interface ConfirmationModalProps extends ModalProps {
	title?: string
	message?: string
	onConfirm: () => void
}


export default function ConfimationModal({ title="CONFIRM", message, onConfirm, ...modalProps }: ConfirmationModalProps) {
	return (
		<Modal {...modalProps} className='bg-cyan relative'>
			<div className='text-white p-5'>
				<div className='flex justify-end w-full mb-3 absolute top-2 right-1'>
					<button onClick={modalProps.closeModal}>
						<Icon icon={"carbon:close"} width={30} />
					</button>
				</div>
				<div>
					<Banner title={title} white />
					<div>
						<h3>{message}</h3>
					</div>
					<div className='flex justify-center'>
						<Button label='Confirm' color='green' className='self-start my-3 px-3 pt-1 pb-1 tex-xs' onClick={onConfirm} />
					</div>
				</div>
			</div>
		</Modal>
	)
}
