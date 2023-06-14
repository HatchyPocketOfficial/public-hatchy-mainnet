import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import useLogin from "../hooks/admin/useLogin";
import { Admin} from "../types";
import { getAdminToken, parseJwt } from "../utils/accounts";

const AdminContext = createContext<{
	loadingLogging: boolean
	login: (username: string, password: string) => Promise<void>
	logout: () => void
	signup: (name: string, username: string, password: string) => Promise<void>
	loadingData: boolean
	adminInfo: Admin | undefined
	setAdminInfo: Dispatch<SetStateAction<Admin | undefined>>
} | undefined>(undefined);

declare let window: any;
const AdminContextProvider = ({ children }: { children: ReactNode }) => {
	const [loadingData, setLoadingData] = useState(false);
	const [adminInfo, setAdminInfo] = useState<Admin>();
	const { loadingLogging, login, logout, signup } = useLogin(setAdminInfo);

	const updateUserInfo = () => {
		const token = getAdminToken();
		if (token != null) {
			const data = parseJwt(token);
			setAdminInfo(data);
		}
	}

	// Fetch user data if already logged
	useEffect(() => {
		updateUserInfo();
	}, []);
	

	/*Assign Provider Value */
	return <AdminContext.Provider value={{
		loadingLogging,
		login,
		logout,
		signup,
		loadingData,
		adminInfo: adminInfo,
		setAdminInfo: setAdminInfo,
	}}>
		{children}
	</AdminContext.Provider>
}

function useAdmin() {
	const context = useContext(AdminContext)
	if (context === undefined) {
		throw new Error('useAdmin must be used within an AdminProvider')
	}
	return context
}

export { AdminContext, AdminContextProvider, useAdmin }