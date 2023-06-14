import { useState } from "react";
import { getToken, sendAuthGetRequest, sendAuthPostRequest } from "../../utils/accounts";

export default function useEditAccount(userId: string | null) {
	const [loadingData, setLoadingData] = useState(false);

	const fetchAvatarList = async () => {
		try {
			setLoadingData(true)
			const res = await sendAuthGetRequest(`account/${userId}/avatarlist`);
			return res
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingData(false)
		}
	}

	const updateField = async (value: string, fieldName: string) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`account/${userId}/${fieldName}`, { [fieldName]: value });
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const updateAvatar = async (value: string) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`account/${userId}/avatar`, { 'avatarId': value });
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const updateReferral = async (value: any) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true)
				const res = await sendAuthPostRequest(`account/${userId}/referral-add`, { 'referrer': value, 'code': getToken() })
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false)
			}
		}
	}

	const changeEmailVisibility = async (status: any) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true)
				const res = await sendAuthPostRequest(`account/${userId}/email-status`, { 'status': status })
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false)
			}
		}
	}

	return { updateField, updateAvatar, updateReferral, changeEmailVisibility, loadingData, fetchAvatarList }
}