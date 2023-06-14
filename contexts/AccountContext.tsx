import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { ACCOUNTS_BASE_URL} from "../constants";
import useAccountFriends from "../hooks/Accounts/useAccountFriends";
import useLogin from "../hooks/Accounts/useLogin";
import { FriendModel, UserModel } from "../types";
import { getStoredAddress, getToken, isSameAccountAddress, parseJwt, sendAuthGetRequest } from "../utils/accounts";

const AccountContext = createContext<{
	loadingLogging: boolean
	login: () => Promise<void>
	logout: () => void
	loadingData: boolean
	loadingDataFriends: boolean
	userInfo: UserModel | undefined
	setUserInfo: Dispatch<SetStateAction<UserModel | undefined>>
	pendingRequests: any
	friendsList: FriendModel[] | undefined
	blockList: FriendModel[] | undefined
	sendFriendRequest: (friendAddress: string) => void
	acceptFriendRequest: (friendAddress: string) => void
	updateFriendsInfo: () => void
	getUserInfo: (id: string) => Promise<any>
} | undefined>(undefined);

declare let window: any;
const AccountContextProvider = ({ children }: { children: ReactNode }) => {
	const updateFriendInfoTimeInterval = 5 * 60 * 1000;
	const [loadingData, setLoadingData] = useState(false);
	const { account } = useWeb3React();
	const [userInfo, setUserInfo] = useState<UserModel>();
	const [friendsList, setFriendsList] = useState<FriendModel[]>();
	const [blockList, setBlockList] = useState<FriendModel[]>();
	const { loadingLogging, login, logout } = useLogin(setUserInfo);
	const {
		updateFriendsInfo,
		sendFriendRequest,
		acceptFriendRequest,
		pendingRequests,
		loadingData: loadingDataFriends } = useAccountFriends(userInfo?._id, setFriendsList, setBlockList);

	// keep online status
	//const { } = useOnlineStatus(userInfo?._id);

	const getUserInfo = async (id: string) => {
		return fetchAccountInfo(id).then((reqUserInfo) => {
			return reqUserInfo.data.data;
		}).catch((e) => {
			console.log(e);
		})
	}

	const updateUserInfo = () => {
		const token = getToken();
		if (token != null) {
			const data = parseJwt(token);
			try {
				setLoadingData(true);
				fetchAccountInfo(data._id)
					.then((reqUserInfo) => {
						setUserInfo(reqUserInfo.data.data);
					})
					.catch((e) => {
						console.log(e);
					}).finally(() => {
						setLoadingData(false);
					});
			} catch (error) {
				console.log(error);
			}

		}
	}

	// Fetch user data if already logged
	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', () => {
				// logout();
			})
		}
		if (account) {
			if (getStoredAddress()) {
				const isSameAddress = isSameAccountAddress(account);
				if (isSameAddress) {
					updateUserInfo();
				} else {
					console.log('logout');
					logout();
				}
			}
		}
	}, [account]);

	useEffect(() => {
		if (userInfo) {
			//update friend data when userInfo change
			const token = getToken();
			if (token != null) updateFriendsInfo()
		}
	}, [userInfo]);

	useEffect(() => {
		const intervalFriendsInfo = setInterval(() => {
			const token = getToken();
			if (token != null) updateFriendsInfo()
		}, updateFriendInfoTimeInterval);
		return () => clearInterval(intervalFriendsInfo);
	}, [])

	/*Assign Provider Value */
	return <AccountContext.Provider value={{
		loadingLogging,
		login,
		logout,
		loadingData,
		userInfo,
		setUserInfo,
		loadingDataFriends,
		pendingRequests,
		friendsList,
		blockList,
		sendFriendRequest,
		acceptFriendRequest,
		updateFriendsInfo,
		getUserInfo
	}}>
		{children}
	</AccountContext.Provider>
}

/* fetch updated user data on reload page */
const fetchAccountInfo = async (userID: string) => {
	return sendAuthGetRequest(`account/${userID}`);
}

function useAccount() {
	const context = useContext(AccountContext)
	if (context === undefined) {
		throw new Error('useAccount must be used within an AccountProvider')
	}
	return context
}

export { AccountContext, AccountContextProvider, useAccount }