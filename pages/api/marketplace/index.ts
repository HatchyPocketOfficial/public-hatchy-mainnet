import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import axios from "axios";
import NextCors from "nextjs-cors";

const SubgraphURI = `https://api.thegraph.com/subgraphs/name/hatchypocket/marketplace`

export default async function MarketplaceAPI(req: NextApiRequest, res: NextApiResponse) {
    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    let { char, page, sort, element, shiny } = req.body;
    console.log({ char, page, sort, element, shiny })
    if (!page) {
        page = 1
        return
    }
    if (!sort) {
        sort = 'asc'
    }
    if (char) {
        char = parseInt(char)
    }
    let q = getQuery(typeof char == "number" ? char : null, parseInt(page), sort, element, shiny)
    console.log(q)
    const { data } = await axios.post(SubgraphURI, {
        query: q
    })
    console.log({ err: data?.errors })
    if (!data?.data?.hatchies) {
        res.status(404)
        return
    }
    console.log({ data: data?.data?.hatchies })
    res.status(200).json(data.data.hatchies)
}


function getQuery(char: any, page: any, sort: any, element: any, shiny: any) {
    return `
        {
           hatchies(first: 12, 
           skip:${page * 12 - 12}, 
           where: {
            isOnSale: true,
            ${char !== null && typeof char !== "undefined" && char !== 'ALL' ? `character: ${char?.toString()},` : ``}
            ${shiny !== null && typeof shiny !== "undefined" && shiny !== 'ALL' ? `isShiny: ${shiny},` : ``}
            ${element !== null && typeof element !== "undefined" ? `element: "${element?.toString()}",` : ``}},
            ${sort == "asc" || sort == "desc" ? "orderBy: price" : ""}, 
            orderDirection: ${sort == "asc" || sort == "oldest" ? "asc" : "desc"})
                {
                    id
                    name
                    element
                    monsterId
                    tokenId
                    character
                    serial
                    isShiny
                    owner
                    isOnSale
                    price
                  }
              }
    `
}