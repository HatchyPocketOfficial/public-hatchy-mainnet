import { sendAuthPostRequest } from "../../utils/accounts";

export default function useVerifyEmail( ) {

	const verify= async (email: string, code: string, userId: string)=>{
		try {
			const res = await sendAuthPostRequest( `account/${userId}/email-verify`, {
				email,
				code
			});
			return res;
		} catch (error) {
			console.log(error);
		}
	}
	
	return { verify}
}
