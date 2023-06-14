import { useState } from "react";
import { UserModel } from "../../types";
import { getAdminToken, getToken, sendAdminAuthPostRequest, sendAuthGetRequest, sendAuthPostRequest } from "../../utils/accounts";

export default function useAdminFunctions(
	userInfo?: UserModel,
) {
	const [loadingData, setLoadingData] = useState(false);

	const fetchBadgeList = async () => {
		try {
			setLoadingData(true);
			const res = await sendAuthGetRequest('admin/badge')
			return res;
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingData(false)
		}
	}

	const fetchCategoryList = async () => {
		try {
			setLoadingData(true);
			const res = await sendAuthGetRequest('admin/category')
			return res;
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingData(false)
		}
	}

	const changePassword = async (oldPassword: string, newPassword: string) => {
		if (userInfo?.username && getAdminToken()) {
			try {
				setLoadingData(true);
				const res = await sendAdminAuthPostRequest(`admin/changepassword`, {
					username: userInfo.username,
					oldPassword,
					newPassword
				});
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}
	const uploadAvatar = async (data: any) => {
		if (userInfo?.username && getToken()) {
			try {
				setLoadingData(true);
				const res = await sendAuthPostRequest(`admin/${userInfo._id}/avatar/add`, data)
				return res;
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false);
			}
		}
	}

	const addCategory = async (value: string) => {
		if (userInfo?._id && getToken()) {
			try {
				setLoadingData(true)
				const res = await sendAuthPostRequest(`admin/${userInfo._id}/category/add`, { "category": value })
				return res
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingData(false)
			}
		}
	}

	const updateAdminInfo = () => {
		fetchBadgeList()
		fetchCategoryList()
	}

	return {
		changePassword,
		uploadAvatar,
		fetchBadgeList,
		fetchCategoryList,
		addCategory,
		updateAdminInfo
	}


}