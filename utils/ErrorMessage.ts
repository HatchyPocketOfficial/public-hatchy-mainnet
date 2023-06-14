import { toast } from "react-toastify";

export const displayError = (message: string) => toast.error(message, {	
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: true,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		});

export const displaySuccess = (message: string) => toast.success(message, {	
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: true,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		});

export const displayWarn = (message: string) => toast.warn(message, {	
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: true,
		closeOnClick: false,
		pauseOnHover: true,
		draggable: false,
		progress: undefined,
		});