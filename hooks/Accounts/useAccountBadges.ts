import { useState } from "react";
import { UserModel } from '../../types'
import { sendAuthGetRequest } from "../../utils/accounts";

export default function useAccountBadges() {
	const [loadingData, setLoadingData] = useState(false);
	const [badgesList, setBadgesList] = useState<UserModel[]>();

	/*
	useEffect(() => {
		if( account && window.localStorage.getItem("access_token")!=null){
			try {
				setLoadingData(true);
				fetchBadges(setBadgesList);
			} catch (error) {
				console.log(error);
			}finally{
				setLoadingData(false);
			}
		}
	}, [])
	*/
	return { loadingData, badgesList }
}

const fetchBadges = async (
	setBadgesList: (data: UserModel[]) => void,
) => {
	const res = await sendAuthGetRequest(`badges`);
	if (res.status === 200) {
		setBadgesList(res.data);
	} else {
		console.log(res.status);
	}
}