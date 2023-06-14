import { useEffect } from "react";
export default function useOnlineStatus(userId?: string) {

	const timeInterval = 30 * 1000;
	const baseUrl = "wss://account-test.hatchypocket.com/socket";
	const client = new WebSocket(baseUrl);

	/*
	receive socket message
	client.onmessage = (message)=> {
		console.log('message received');
		const data = JSON.parse(message.data);
		console.log(data);
		switch (data.type) {
			default:
				//updateFriendsInfo();	
				break;
		}
	};
	*/

	const updateOnlineStatus = () => {
		if (client.readyState == 1 && userId) {
			const statusData = {
				type: 'online',
				id: userId,
				current: new Date()
			}
			try {
				client.send(JSON.stringify(statusData));
			} catch (error) {
				console.log(error);
			}
		}
	}

	useEffect(() => {
		client.onopen = (event) => {
			if (userId) updateOnlineStatus();
		};

		if (userId) {
			const interval = setInterval(() => updateOnlineStatus(), timeInterval);
			return () => clearInterval(interval);
		}
	}, [userId]);

	return {
	}
}