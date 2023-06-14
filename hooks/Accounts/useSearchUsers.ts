import axios from "axios";
import { useState } from "react";
import { ACCOUNTS_BASE_URL } from "../../constants";

export default function useSearchUsers() {
	const [loadingData, setLoadingData] = useState(false);

	const search = async (key: string) => {
		try {
			setLoadingData(true);
			const res = await searchUsers(key);
			return res;
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingData(false);
		}
	}

	return { search, loadingData }
}

const searchUsers = async (key: string) => {
	return axios.get(
		`${ACCOUNTS_BASE_URL}/account/search?key=${key}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}