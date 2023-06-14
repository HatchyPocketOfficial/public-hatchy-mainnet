import axios from "axios";
import { useEffect, useState } from "react";
import { METADATA_BASE_URL } from "../constants";

export default function useMarketSingle(id: number) {
	const [listings, setListings] = useState(null)
	useEffect(() => {
		if (id) {
			axios.post(`${METADATA_BASE_URL}/api/marketplace/single/${id}`, {}).then(res => {
				if (!res.data) {
					alert('Error while fetching API')
					return
				}
				if (res.data[0]) {
					setListings(res.data.length > 0 ? res.data[0] : null)
				}
				//console.log(res.data)
			}).catch(err => console.log(err))
		}
	}, [id])
	return {
		listings
	}
}