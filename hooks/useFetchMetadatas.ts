import { useEffect, useState } from "react";
import axios from "axios";
import { Metadata } from "../types";
import { METADATA_BASE_URL } from "../constants";

let globalMetadatas: Array<Metadata> | null = null;
export default function useFetchMetadatas(tokens?: Array<string> | null) {
	const [metadata, setMetadatas] = useState<Array<Metadata> | null>(null)
	useEffect(() => {
		if(tokens?.length == 0) {
			globalMetadatas = null;
			setMetadatas([]);
		}
		if (tokens && tokens.length > 0) {
			fetchMetadata(tokens, setMetadatas)
		}
	}, [tokens])
	return metadata
}

const fetchMetadata = async (
	tokenIds: Array<string>,
	setMetadata: (json: any) => void,
) => {
	try {
		axios.post(
			`${METADATA_BASE_URL}/api/tokens`, tokenIds,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		)
			.then((res) => {
				if (res.status === 200) {
					const tokens = res.data;
					setMetadata(tokens);
					globalMetadatas = tokens;
				} else {
					setMetadata([]);
				}
			})
	} catch (e) {
		console.log(e)
	}
}