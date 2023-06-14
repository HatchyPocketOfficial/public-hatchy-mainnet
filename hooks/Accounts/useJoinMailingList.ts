import axios from "axios";
import { ACCOUNTS_BASE_URL } from "../../constants";

export default function useJoinMailingList( ) {

	const subscribeMailingList = async (email: string)=>{
		try {
			return await axios.post(
				`${ACCOUNTS_BASE_URL}/mailing`,
				{
					email
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
		} catch (error) {
			console.log(error);
		}
	}

	const verifySubscription = async (email: string, code: string)=>{
		try {
			return await axios.post(
				`${ACCOUNTS_BASE_URL}/mailing/verify`,
				{
					email,
					code
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			)
		} catch (error) {
			console.log(error);
		}
	}
	
	return {subscribeMailingList, verifySubscription}
}
