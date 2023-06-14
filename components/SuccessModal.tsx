import { Icon } from '@iconify/react';
import React from 'react'
import Banner from './Banner';
import Modal, { ModalProps } from './Modal';

interface SuccessModalProps extends ModalProps {
	title?: string,
	text?: string
}

export default function SuccessModal({title="Success", text, ...modalProps}:SuccessModalProps) {
  return (
    <Modal {...modalProps} className={`bg-cyan w-80 lg:w-96`}>
			<div className='text-white'>
				<div className='flex justify-end w-full'>
					<button onClick={modalProps.closeModal}>
						<Icon icon={"carbon:close"} width={30} />
					</button>
				</div>
				<div className='flex flex-col items-center justify-center w-full pb-5'>
					<div className='flex justify-between w-full'>
						<Banner title={title} white />
					</div>
					<Icon icon="ep:success-filled" width={100}/>
					<span className='pt-10'>
						{text}
					</span>
				</div>
			</div>
		</Modal>
  )
}
