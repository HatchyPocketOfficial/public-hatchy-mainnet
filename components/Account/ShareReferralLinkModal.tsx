import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react'
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import useAccountReferrals from '../../hooks/Accounts/useAccountReferrals';
import useCopyText from '../../hooks/useCopyText';
import { displayError, displaySuccess } from '../../utils/ErrorMessage';
import Banner from '../Banner';
import Input from '../Input';
import Modal, { ModalProps } from '../Modal';

interface ShareModalProps extends ModalProps {
	userId?: string
}

export default function ShareReferalLinkModal({ userId, ...modalProps }: ShareModalProps) {
	const [referralURL, setReferralURL] = useState<string>();
	const [isCopied, setIsCopied] = useState(false)
	//get referral url
	const { fetchReferralURL } = useAccountReferrals(userId);
	const {copy} = useCopyText();

	const copyText = async () => {
		if (!isCopied && referralURL) {
			await copy(referralURL, navigator, window);
			setIsCopied(true)
			displaySuccess('Link copied!');
			setTimeout(() => {
				setIsCopied(false)
			}, 5000)
		}
	}

	useEffect(() => {
		fetchReferralURL().then((res) => {
			if (res?.data.code == 200) {
				setReferralURL(res.data.data);
			} else {
				displayError(res?.data.message)
			}
		})
	}, []);

	return (
		<Modal {...modalProps} className='bg-cyan relative h-auto p-10 w-80 md:w-1/3'>
			<div className='text-white'>
				<div>
					<div className='flex justify-end w-full mb-3 absolute top-1 right-1'>
						<button onClick={modalProps.closeModal}>
							<Icon icon={"carbon:close"} width={30} />
						</button>
					</div>
					<div className='flex justify-between w-full lg:pl-5'>
						<Banner title='Share referral link' white />
					</div>
				</div>
				<div className='flex flex-col items-center'>
					<h3>Share in your social media</h3>
				</div>
				<div className='flex justify-center items-center'>
					<TwitterShareButton url={referralURL || 'https://hatchypocket.com/'} hashtags={['HatchyPocket', 'NFT']} title='Get into Hatchy Pocket!'>
						<div className='w-20 h-20 bg-white bg-opacity-40 rounded-full flex justify-center items-center m-4'>
							<Icon icon="akar-icons:twitter-fill" className='text-white' width={40} />
						</div>
					</TwitterShareButton>
					<FacebookShareButton url={referralURL || 'https://hatchypocket.com/'} quote='Get into Hatchy Pocket!'>
						<div className='w-20 h-20 bg-white bg-opacity-40 rounded-full flex justify-center items-center m-4'>
							<Icon icon="ant-design:facebook-filled" className='text-white' width={40} />
						</div>
					</FacebookShareButton>
				</div>
				<div>
					<div>
						<h3>Referral link ID:</h3>
					</div>
					<div className='w-full h-10 flex justify-between items-center p-5'>
						<Input
							value={referralURL || ''}
							className='w-full mr-5'
							readOnly
						/>
						{isCopied ?
							<div className='flex flex-row'>
								<span className='mr-5'>Copied!</span>
								<Icon icon="akar-icons:check" className='text-white' width={20} onClick={copyText} />
							</div>
							:
							<Icon icon="akar-icons:copy" className='text-white hover:cursor-pointer' width={20} onClick={copyText} />
						}
					</div>
				</div>
				<div>
				</div>
			</div>
		</Modal>
	)
}
