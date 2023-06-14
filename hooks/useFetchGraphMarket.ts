import {useEffect, useState} from "react";
import axios from "axios";
import { METADATA_BASE_URL } from "../constants";
import { MarketplaceMetadata } from "../types";

//Verify types
export default function useFetchGraphMarket(
    char: string, 
    page: number, 
    sort: string, 
    elem: string,
    shiny: 'ALL' | boolean
) {
    const [listings, setListings] = useState<Array<MarketplaceMetadata>>([])
    const [total, setTotal] = useState(5000)
    useEffect(() => {
        axios.post(`${METADATA_BASE_URL}/api/marketplace`, {
            char: char == "ALL" ? null : char, page, sort, element: elem == "ALL" ? null : elem, shiny
        }).then(res => {
            if (!res.data) {
                alert('Error while fetching API')
                return
            }
            setListings(res.data)
        }).catch(err => console.log(err))
    }, [char, page, sort, elem,shiny])
    return {
        listings,
        total
    }
}