import { useState } from "react";
import { UserModel } from '../../types'
import { getToken, sendAuthGetRequest, sendAuthPostRequest } from "../../utils/accounts";

export default function useAccountReferrals(userId?: string) {
	const [loadingData, setLoadingData] = useState(false);
	const [referralsList, setReferralsList] = useState<UserModel[]>();
	//const {loadingLogging, logged} = useLogin();

	const sendReferralInvitation = async (email: string) => {
		if (userId && getToken() != null) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`account/${userId}/referral`, { email });
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const fetchReferralURL = async () => {
		if (userId && getToken() != null) {
			try {
				setLoadingData(true);
				const res = await sendAuthGetRequest(`account/${userId}/referral-url`);
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	return { loadingData, referralsList, sendReferralInvitation, fetchReferralURL }
}

const fetchReferralsList = async (
	setReferralsList: (data: UserModel[]) => void,
) => {
	const res = await sendAuthGetRequest(`referrals/all`);
	if (res.status === 200) {
		setReferralsList(res.data);
	} else {
		console.log(res.status);
	}
}