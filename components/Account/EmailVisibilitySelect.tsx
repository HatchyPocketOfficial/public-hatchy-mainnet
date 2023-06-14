import { Icon } from '@iconify/react';
import React, { SelectHTMLAttributes, useEffect, useState } from 'react'
import useEditAccount from '../../hooks/Accounts/useEditAccount';
import { UserModel } from '../../types';
import { displayError, displaySuccess } from '../../utils/ErrorMessage';

interface EmailVisibilitySelect extends SelectHTMLAttributes<HTMLSelectElement> {
	userInfo: UserModel,
	setUserInfo: (user: UserModel) => void,
}

export default function EmailVisibilitySelect({ userInfo, setUserInfo, className, ...defaultProps }: EmailVisibilitySelect) {

	const { changeEmailVisibility } = useEditAccount(userInfo._id);
	const [visibilityValue, setVisibilityValue] = useState(userInfo.email_status)

	useEffect(() => {
		setVisibilityValue(userInfo.email_status)

	}, [userInfo])

	const optionsVisibility = [
		'Hidden',
		'Friends Only',
		'All visible'
	]

	const changeVisibility = (e: string) => {
		changeEmailVisibility(Number(e)).then((res) => {
			if (res?.data.code == 200) {
				displaySuccess('Changed email visibility!');
				setUserInfo(res.data.data)
			} else {
				displayError(res?.data.message)
			}
		})
	}

	return (
		<div className='mt-1 flex flex-row space-x-5'>
			{
				optionsVisibility.map((option, i) => (
					<div key={i} className='flex flex-col'>
						<input type="radio" id={option} value={i} name='emailVisibility' onChange={(e) => changeVisibility(e.target.value)}
							checked={i == visibilityValue} />
						<label htmlFor={option} className={'text-xs'}>{option}</label>
					</div>
				))
			}
		</div>
	)
}
