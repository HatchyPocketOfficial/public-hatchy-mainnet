import { useState } from "react";
import { getToken, sendAuthGetRequest, sendAuthPostRequest } from "../../utils/accounts";
import { FriendModel } from "../../types";

interface useAccountFriendsProps {
	userId?: string
	setFriendsList?: (friends: FriendModel) => void
	setBlockList?: (friends: FriendModel) => void
}
export default function useAccountFriends(
	userId?: string,
	setFriendsList?: (friends: FriendModel[]) => void,
	setBlockList?: (friends: FriendModel[]) => void
) {
	const [loadingData, setLoadingData] = useState(false);
	const [pendingRequests, setPendingRequests] = useState([]);
	//const {loadingLogging, logged} = useLogin();
	const updateFriendsInfo = () => {
		fetchFriendsList();
		fetchBlockList();
	}
	/* fetch updated friend list of user on reload page */
	const fetchFriendsList = async () => {
		if (setFriendsList && userId) {
			try {
				setLoadingData(true);
				sendAuthGetRequest(`friend/${userId}?key=&page=1&size=9`).then((res) => {
					if (res?.data.code == 200) {
						setFriendsList(res.data.data.data);
					} else {
						console.log(res?.data.message);
					}
				}).catch(e => console.log(e));
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	/* fetch updated block list of user on reload page */
	const fetchBlockList = async () => {
		if (setBlockList && userId) {
			try {
				setLoadingData(true);
				sendAuthGetRequest(`block/${userId}?key=&page=1&size=9`).then((res) => {
					if (res?.data.code == 200) {
						setBlockList(res.data.data.data);
					} else {
						console.log(res?.data.message);
					}
				}).catch(e => console.log(e));
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const sendFriendRequest = async (value: string) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`friend/${userId}/request`, { ["receiver"]: value });
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const acceptFriendRequest = async (friendId: string) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`friend/${userId}/accept`, { ["receiver"]: friendId });
				setLoadingData(false);
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const declineFriendRequest = async (friendId: string) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`friend/${userId}/decline`, { ['receiver']: friendId });
				setLoadingData(false);
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const blockFriend = async (friendId: string) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`block/${userId}/add`, { ['blocker']: friendId });
				setLoadingData(false);
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const unblockFriend = async (friendId: string) => {
		if (userId && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`block/${userId}/remove`, { ['blocker']: friendId });
				setLoadingData(false);
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	return {
		loadingData,
		fetchFriendsList,
		fetchBlockList,
		updateFriendsInfo,
		updateFriendsList: fetchFriendsList,
		updateBlockList: fetchBlockList,
		pendingRequests,
		sendFriendRequest,
		acceptFriendRequest,
		declineFriendRequest,
		blockFriend,
		unblockFriend
	}
}