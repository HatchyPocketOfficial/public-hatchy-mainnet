import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { ACCOUNTS_BASE_URL, ADMIN_TOKEN_STORAGE_KEY, } from "../../constants";
import { Admin } from "../../types";

export default function useLogin(setAdminInfo: Dispatch<SetStateAction<Admin | undefined>>) {
	const [loadingLogging, setLoadingLogging] = useState(false);

	const login = async (username: string, password: string) => {
		setLoadingLogging(true);
		try {
			const resLogin = (await callAdminLogin(username, password)).data;
			if (resLogin.code === 200) {
				window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, resLogin.data.token);
				setAdminInfo(resLogin.data.data);
			} else {
				console.log(resLogin.message);
			}
			return resLogin;
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingLogging(false);
		}
	}

	const signup = async (name: string, username: string, password: string) => {
		setLoadingLogging(true);
		try {
			const resSignUp = (await callAdminSignUp(name, username, password)).data;
			if (resSignUp.code === 200) {
				window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, resSignUp.data.token);
				setAdminInfo(resSignUp.data.data);
			} else {
				console.log(resSignUp.message);
			}
			return resSignUp;
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingLogging(false);
		}
	}

	const logout = () => {
		window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
		setAdminInfo(undefined);
	}
	return { loadingLogging, login, logout, signup }
}

const callAdminLogin = async (
	username: string,
	password: string
) => {
	return axios.post(
		`${ACCOUNTS_BASE_URL}/admin/login`, { username, password },
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}

const callAdminSignUp = async (
	name: string,
	username: string,
	password: string
) => {
	return axios.post(
		`${ACCOUNTS_BASE_URL}/admin/signup`, { name, username, password },
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}