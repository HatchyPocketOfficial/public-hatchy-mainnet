import { Icon } from '@iconify/react';
import React, { useState } from 'react'
import ReactModal from 'react-modal';
import { FacebookIcon, FacebookShareButton, RedditShareButton, TwitterShareButton } from 'react-share';
import { APP_URL } from '../../utils';
import Banner from '../Banner';
import Modal, { ModalProps } from '../Modal';

interface ShareModalProps extends ModalProps {
	token?: number
}

export default function ShareModal ({ token, ...modalProps }:ShareModalProps) {
	const [isCopied, setIsCopied] = useState(false)
    const copyText = () => {
		if(token){
			navigator.clipboard.writeText(`${APP_URL}/hatchy/${token?.toString()}`)
			setIsCopied(true)
			setTimeout(() => {
				setIsCopied(false)
			}, 5000)
		}
    }
	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10'>
				<div className='text-white'>
					<div>
						<div className='flex justify-end w-full mb-3 absolute top-1 right-1'>
							<button onClick={modalProps.closeModal}>
								<Icon icon={"carbon:close"} width={30} />
							</button>
						</div>
						<div className='flex justify-between w-full lg:pl-5'>
							<Banner title='Share in your Social Media' white />
						</div>
					</div>
					<div className='flex justify-center items-center'>
						<TwitterShareButton url='https://hatchypocket.com/' hashtags={['HatchyPocket','NFT']} title='Get into Hatchy Pocket!'>
							<div className='w-20 h-20 bg-white bg-opacity-40 rounded-full flex justify-center items-center m-4'>
								<Icon icon="akar-icons:twitter-fill" className='text-white' width={40}/>
							</div>
						</TwitterShareButton>
						<FacebookShareButton url='https://hatchypocket.com/' quote='Get into Hatchy Pocket!'>
							<div className='w-20 h-20 bg-white bg-opacity-40 rounded-full flex justify-center items-center m-4'>
								<Icon icon="ant-design:facebook-filled" className='text-white' width={40}/>
							</div>
						</FacebookShareButton>
						<RedditShareButton url='https://hatchypocket.com/' title='Get into Hatchy Pocket!'>
							<div className='w-20 h-20 bg-white bg-opacity-40 rounded-full flex justify-center items-center m-4'>
								<Icon icon="akar-icons:reddit-fill" className='text-white' width={40}/>
							</div>
						</RedditShareButton>
					</div>
					<div>
						<div>
							<h3>Page Link</h3>
						</div>
						<div className='bg-white bg-opacity-40 w-full h-10 flex justify-between items-center p-5'>
							<p>
								{token?
									`${APP_URL}/hatchy/${token?.toString()}`
								:'Select a Hatchy Token first'}
							</p>
							{isCopied?
								<div className='flex flex-row'>
									<span className='mr-5'>Copied!</span>
									<Icon icon="akar-icons:check" className='text-white' width={20} onClick={copyText}/>
								</div>
							:
								<Icon icon="akar-icons:copy" className='text-white' width={20} onClick={copyText}/>
							}
						</div>
					</div>
					<div>
					</div>
				</div>
		</Modal>
	)
}
