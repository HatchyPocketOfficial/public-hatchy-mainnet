import { Icon } from '@iconify/react';
import React from 'react'
import Banner from '../Banner';
import Modal, { ModalProps } from '../Modal';

interface Props extends ModalProps {
}

export default function BatchTransferModal({ ...modalProps}:Props) {
  return (
    <Modal {...modalProps} className={`bg-cyan w-80 lg:w-96 relative`}>
			<div className='text-white'>
				<div className='absolute top-1 right-1 z-10'>
					<button onClick={modalProps.closeModal}>
						<Icon icon={"carbon:close"} width={30} />
					</button>
				</div>
				<div className='flex flex-col items-center justify-center w-full pb-5'>
					<div className='flex justify-between w-full'>
						<Banner title={'Successful Transfer'} white />
					</div>
					<div className='text-yellow pb-4'>
						<Icon icon="clarity:warning-standard-solid" width={40}/>
					</div>
					<span className=''>
						Remember to DISAPPROVE contract once you are done using it as it could be a security issue 
					</span>
				</div>
			</div>
		</Modal>
  )
}
