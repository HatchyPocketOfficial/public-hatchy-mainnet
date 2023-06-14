import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";
import usePersonalSign from "../usePersonalSign";
import { ACCOUNTS_BASE_URL, ADDRESS_STORAGE_KEY, TOKEN_STORAGE_KEY } from "../../constants";
import { UserModel } from "../../types";
import { parseJwt } from "../../utils/accounts";
import { coreWallet, metaMask } from '../../connectors';


export default function useLogin(setUserInfo: Dispatch<SetStateAction<UserModel | undefined>>) {
	const [loadingLogging, setLoadingLogging] = useState(false);
	const { account } = useWeb3React();
	const sign = usePersonalSign();

	const login = async () => {
		if (account) {
			setLoadingLogging(true);
			try {
				//fetch nonce
				const resNonce = (await fetchNonce(account)).data;
				if (resNonce.code === 200) {
					const nonce = resNonce.data;
					//sign nonce
					const loginSignature = await sign(nonce);
					//auth with signature
					const resLogin = (await callLogin(account, loginSignature)).data;
					if (resLogin.code === 200) {
						//window.localStorage.setItem(userDataStorageKey, JSON.stringify(resLogin.data.data));
						window.localStorage.setItem(TOKEN_STORAGE_KEY, resLogin.data.token);
						window.localStorage.setItem(ADDRESS_STORAGE_KEY, account);
						setUserInfo(resLogin.data.data);
					} else {
						console.log(resLogin.status);
					}
				} else {
					console.log(resNonce.status);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoadingLogging(false);
			}
		}
	}

	const loginReferral = async (token: string) => {
		if (account) {
			setLoadingLogging(true);
			try {
				//fetch nonce
				const resNonce = (await fetchNonce(account)).data;
				if (resNonce.code === 200) {
					const nonce = resNonce.data;
					//sign nonce
					const loginSignature = await sign(nonce);
					//get referrer data
					const data = parseJwt(token);
					//auth with signature
					const resLogin = (await callLoginReferral(
						account,
						loginSignature,
						// data.email,
						// data.code,
						data.referrer
					)).data;
					if (resLogin.code === 200) {
						window.localStorage.setItem(TOKEN_STORAGE_KEY, resLogin.data.token);
						window.localStorage.setItem(ADDRESS_STORAGE_KEY, account);
						setUserInfo(resLogin.data.data);
					} else {
						console.log(resLogin.status);
					}
					return resLogin;
				} else {
					console.log(resNonce.status);
				}
			} catch (error) {
				console.log(error);
				throw error;
			} finally {
				setLoadingLogging(false);
			}
		}
	}

	const logout = () => {
		window.localStorage.removeItem(TOKEN_STORAGE_KEY);
		window.localStorage.removeItem(ADDRESS_STORAGE_KEY);

		const wallet = getLastWallet()
		if (wallet == "metamask") {
			metaMask?.deactivate?.()
			location.reload();
		} else if (wallet == "core") {
			coreWallet?.deactivate?.()
			location.reload();
		}

		window.localStorage.removeItem("_prefferred_wallet");
		setUserInfo(undefined);
	}
	return { loadingLogging, login, loginReferral, logout }
}

const getLastWallet = () => {
	if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
		const lastUsedWallet = localStorage.getItem('_prefferred_wallet')
		return lastUsedWallet
	}

	return ""
}

const fetchNonce = async (address: string) => {
	return axios.get(
		`${ACCOUNTS_BASE_URL}/auth/${address}`,
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}

const callLogin = async (
	address: string,
	signature: string
) => {
	return axios.post(
		`${ACCOUNTS_BASE_URL}/auth`, { address, signature },
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}

const callLoginReferral = async (
	address: string,
	signature: string,
	// email: string,
	// code: string,
	referrer: string
) => {
	return axios.post(
		`${ACCOUNTS_BASE_URL}/auth/referral`, {
		address,
		signature,
		// email,
		// code,
		referrer
	},
		{
			headers: {
				"Content-Type": "application/json",
			},
		}
	)
}