import { useEffect, useState } from "react";
import { METADATA_BASE_URL } from "../constants";
import { Metadata } from "../types";
const metadatas: Array<Metadata> = []

export default function useMetadata(tokenId: number) {
	const [metadata, setMetadata] = useState<Metadata | null>(null)

	useEffect(() => {
		const exist = metadatas.find(a => a.tokenId === tokenId)
		if (exist) {
			setMetadata(exist)
			return
		}

		if (!metadata) {
			fetchMetadata(tokenId, setMetadata)
		}
	}, [tokenId])
	return metadata
}

const fetchMetadata = async (
	tokenId: number,
	setMetadata: (metadata: Metadata) => void
) => {
	try {
		//console.log('request')
		const data = await fetch(`${METADATA_BASE_URL}/api/token/${tokenId}`)
		if (!data.ok) return;
		const json = await data.json();
		if (json) {
			setMetadata(json);
			metadatas.push(json);
		}
	} catch (e) {
		console.log(e)
	}
}