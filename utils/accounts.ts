import axios from "axios"
import { ACCOUNTS_BASE_URL, ADDRESS_STORAGE_KEY, ADMIN_TOKEN_STORAGE_KEY, TOKEN_STORAGE_KEY } from "../constants"

export const isOnline = (lastDate: Date)=>{
	const currentDate = new Date();
	const seconds = (currentDate.getTime()-lastDate.getTime())/1000;
	return seconds<60
}

export const sendAuthGetRequest = async (
	url: string
) => {
	return await axios.get(
		`${ACCOUNTS_BASE_URL}/${url}`,
		{
			headers: {
				"Content-Type": "application/json",
				"x-access-token": `${getToken()}`
			},
		}
	)
}

export const sendAuthPostRequest = async (
	url: string,
	data: any
) => {
	return await axios.post(
		`${ACCOUNTS_BASE_URL}/${url}`, data,
		{
			headers: {
				"Content-Type": "application/json",
				"x-access-token": `${getToken()}`
			},
		}
	)
}

export const sendAdminAuthPostRequest = async (
	url: string,
	data: any
) => {
	return (await axios.post(
		`${ACCOUNTS_BASE_URL}/${url}`, data,
		{
			headers: {
				"Content-Type": "application/json",
				"x-access-token": `${getToken()}`
			},
		}
	)).data;
}

export const parseJwt = (token: string) =>{
	var base64Payload = token.split('.')[1];
	var payload = Buffer.from(base64Payload, 'base64');
	return JSON.parse(payload.toString());
}

export const getToken = ()=> window.localStorage.getItem(TOKEN_STORAGE_KEY);
export const getAdminToken = ()=>{
	if (typeof window=='undefined') return;
	return window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}
export const isSameAccountAddress = (address: string)=> address === window.localStorage.getItem(ADDRESS_STORAGE_KEY);
export const getStoredAddress = ()=> window.localStorage.getItem(ADDRESS_STORAGE_KEY);